<template>
    <BaseLayoutWithError
        :title-segments="titleSegments"
        :tabs="tabs"
        :right-sidebar-items="rightSidebarItems"
        :left-sidebar-items="leftSidebarItems"
        :data-present="!!component"
        :evaluating="evaluating"
    >
        <template #content>
            <router-view />
        </template>
    </BaseLayoutWithError>
</template>

<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import { computed, inject, provide, ref, shallowRef } from "vue";
import { type RouteLocationRaw, useRoute } from "vue-router";
import { eventBusKey, trackableKey } from "@/util/keys";
import { onEvent } from "@/util/eventBus";
import BaseLayoutWithError from "@/components/BaseLayoutWithError.vue";
import { graphql } from "@/gql";
import { queryNodeThrow } from "@/gql/client";
import { withErrorMessage } from "@/util/withErrorMessage";

const getComponentQuery = graphql(`
    query getComponent($id: ID!) {
        node(id: $id) {
            id
            ... on Component {
                __typename
                name
                description
                ...OpenIssueCount
                createIssues: hasPermission(permission: CREATE_ISSUES)
                manageLabels: hasPermission(permission: MANAGE_LABELS)
                manageIssues: hasPermission(permission: MANAGE_ISSUES)
                manageIssueBoards: hasPermission(permission: MANAGE_ISSUE_BOARDS)
                manageIMS: hasPermission(permission: MANAGE_IMS)
                admin: hasPermission(permission: ADMIN)
            }
        }
    }
`);

const getVersionedNodeQuery = graphql(`
    query getVersionedNode($id: ID!) {
        node(id: $id) {
            id
            ... on Versioned {
                version
            }
        }
    }
`);

const getNamedNodeQuery = graphql(`
    query getNamedNodeComponent($id: ID!) {
        node(id: $id) {
            id
            ... on Named {
                name
            }
        }
    }
`);

const route = useRoute();
const componentId = computed(() => route.params.trackable as string);
const componentVersionId = computed(() => route.params.version as string | undefined);
const interfaceSpecificationId = computed(() => route.params.interfaceSpecification as string | undefined);
const interfaceSpecificationVersionId = computed(
    () => route.params.interfaceSpecificationVersion as string | undefined
);
const issueBoardId = computed(() => route.params.board as string | undefined);
const eventBus = inject(eventBusKey);

const titleSegmentDependency = ref(0);
onEvent("title-segment-changed", () => {
    titleSegmentDependency.value++;
});
const evaluating = shallowRef(false);
const component = computedAsync(
    async () => {
        if (!componentId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return await withErrorMessage(() => {
            return queryNodeThrow(getComponentQuery, "Component", { id: componentId.value });
        }, "Error loading component");
    },
    null,
    { shallow: false, evaluating }
);

const version = computedAsync(
    async () => {
        if (!componentVersionId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return (await withErrorMessage(
            () => queryNodeThrow(getVersionedNodeQuery, "ComponentVersion", { id: componentVersionId.value! }),
            "Error loading component version"
        )) as { id: string; version: string };
    },
    null,
    { shallow: false }
);

const interfaceSpecification = computedAsync(
    async () => {
        if (!interfaceSpecificationId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return (await withErrorMessage(
            () =>
                queryNodeThrow(getNamedNodeQuery, "InterfaceSpecification", {
                    id: interfaceSpecificationId.value!
                }),
            "Error loading interface specification"
        )) as { id: string; name: string };
    },
    null,
    { shallow: false }
);

const interfaceSpecificationVersion = computedAsync(
    async () => {
        if (!interfaceSpecificationVersionId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return (await withErrorMessage(
            () =>
                queryNodeThrow(getVersionedNodeQuery, "InterfaceSpecificationVersion", {
                    id: interfaceSpecificationVersionId.value!
                }),
            "Error loading interface specification version"
        )) as { id: string; version: string };
    },
    null,
    { shallow: false }
);

const issueBoard = computedAsync(
    async () => {
        if (!issueBoardId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return (await withErrorMessage(
            () => queryNodeThrow(getNamedNodeQuery, "IssueBoard", { id: issueBoardId.value! }),
            "Error loading issue board"
        )) as { id: string; name: string };
    },
    null,
    { shallow: false }
);

provide(trackableKey, component);

function componentPath(name: string): RouteLocationRaw {
    return {
        name,
        params: { trackable: componentId.value }
    };
}

function componentVersionPath(name: string): RouteLocationRaw {
    return {
        name,
        params: { trackable: componentId.value, version: componentVersionId.value }
    };
}

function interfaceSpecificationPath(name: string): RouteLocationRaw {
    return {
        name,
        params: { trackable: componentId.value, interfaceSpecification: interfaceSpecificationId.value }
    };
}

function interfaceSpecificationVersionPath(name: string): RouteLocationRaw {
    return {
        name,
        params: {
            trackable: componentId.value,
            interfaceSpecification: interfaceSpecificationId.value,
            interfaceSpecificationVersion: interfaceSpecificationVersionId.value
        }
    };
}

const titleSegments = computed(() => {
    const segments = [
        { icon: "$component", path: "/components" },
        { name: component.value?.name ?? "", path: componentPath("component") }
    ];
    const versionValue = version.value;
    if (versionValue != undefined && componentVersionId.value != undefined) {
        segments.push({ name: `v${versionValue.version}`, path: componentVersionPath("component-version-general") });
    }
    const interfaceSpecificationValue = interfaceSpecification.value;
    if (interfaceSpecificationValue != undefined && interfaceSpecificationId.value != undefined) {
        segments.push({
            name: interfaceSpecificationValue.name,
            path: interfaceSpecificationPath("interface-specification-versions")
        });
    }
    const interfaceSpecificationVersionValue = interfaceSpecificationVersion.value;
    if (interfaceSpecificationVersionValue != undefined && interfaceSpecificationVersionId.value != undefined) {
        segments.push({
            name: `v${interfaceSpecificationVersionValue.version}`,
            path: interfaceSpecificationVersionPath("interface-specification-version-general")
        });
    }
    const issueBoardValue = issueBoard.value;
    if (issueBoardValue != undefined && issueBoardId.value != undefined) {
        segments.push({ name: issueBoardValue.name, path: componentPath("component-issue-boards") });
    }
    return segments;
});

const tabs = computed(() => {
    if (componentVersionId.value != undefined || interfaceSpecificationVersionId.value != undefined) {
        return [];
    } else if (interfaceSpecificationId.value != undefined) {
        return [
            { name: "Versions", path: interfaceSpecificationPath("interface-specification-versions") },
            {
                name: "Details",
                path: interfaceSpecificationPath("interface-specification-details-general"),
                exact: false
            }
        ];
    } else {
        return [
            { name: "Home", path: componentPath("component") },
            { name: "Details", path: componentPath("component-details-general"), exact: false },
            { name: "Versions", path: componentPath("component-versions"), exact: false },
            { name: "Issues", path: componentPath("component-issues"), exact: false },
            { name: "Boards", path: componentPath("component-issue-boards"), exact: false }
        ];
    }
});

const leftSidebarItems = computed(() => {
    if (route.name?.toString().startsWith("component-details")) {
        return [
            [
                {
                    icon: "mdi-home",
                    name: "General",
                    color: "secondary",
                    to: componentPath("component-details-general")
                },
                {
                    icon: "$interface",
                    name: "Interfaces",
                    color: "secondary",
                    to: componentPath("component-details-interfaces")
                },
                {
                    icon: "mdi-label",
                    name: "Labels",
                    color: "secondary",
                    to: componentPath("component-details-labels")
                },
                {
                    icon: "$ims",
                    name: "Syncs to",
                    color: "secondary",
                    to: componentPath("component-details-sync"),
                    disabled: !(component?.value?.manageIMS ?? false)
                },
                {
                    icon: "mdi-shield-lock",
                    name: "Access",
                    color: "secondary",
                    to: componentPath("component-details-permissions"),
                    disabled: !(component?.value?.admin ?? false)
                }
            ],
            [
                {
                    icon: "mdi-alert",
                    name: "Danger",
                    color: "error",
                    to: componentPath("component-details-danger"),
                    disabled: !(component?.value?.admin ?? false)
                }
            ]
        ];
    } else if (route.name?.toString().startsWith("component-version-")) {
        return [
            [
                {
                    icon: "mdi-home",
                    name: "General",
                    color: "secondary",
                    to: componentPath("component-version-general")
                },
                {
                    icon: "$interface",
                    name: "Interfaces",
                    color: "secondary",
                    to: componentPath("component-version-interfaces")
                }
            ],
            [
                {
                    icon: "mdi-alert",
                    name: "Danger",
                    color: "error",
                    to: componentPath("component-version-danger"),
                    disabled: !(component?.value?.admin ?? false)
                }
            ]
        ];
    } else if (route.name?.toString().startsWith("interface-specification-details")) {
        return [
            [
                {
                    icon: "mdi-home",
                    name: "General",
                    color: "secondary",
                    to: interfaceSpecificationPath("interface-specification-details-general")
                }
            ],
            [
                {
                    icon: "mdi-alert",
                    name: "Danger",
                    color: "error",
                    to: interfaceSpecificationPath("interface-specification-details-danger"),
                    disabled: !(component?.value?.admin ?? false)
                }
            ]
        ];
    } else if (route.name?.toString().startsWith("interface-specification-version-")) {
        return [
            [
                {
                    icon: "mdi-home",
                    name: "General",
                    color: "secondary",
                    to: interfaceSpecificationVersionPath("interface-specification-version-general")
                }
            ],
            [
                {
                    icon: "mdi-alert",
                    name: "Danger",
                    color: "error",
                    to: interfaceSpecificationVersionPath("interface-specification-version-danger"),
                    disabled: !(component?.value?.admin ?? false)
                }
            ]
        ];
    } else {
        return [];
    }
});

const rightSidebarItems = computed(() => {
    if (route.name == "component-issues" || route.name == "component-issue") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create issue`,
                    color: "secondary",
                    disabled: !(component?.value?.createIssues ?? false),
                    onClick: () => {
                        eventBus?.emit("create-issue", undefined);
                    }
                },
                {
                    icon: "mdi-import",
                    description: "Import issue",
                    color: "secondary",
                    disabled: !(component?.value?.manageIssues ?? false),
                    onClick: () => {
                        eventBus?.emit("import-issue", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "component-issue-boards") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create issue board`,
                    color: "secondary",
                    disabled: !(component?.value?.manageIssueBoards ?? false),
                    onClick: () => {
                        eventBus?.emit("create-issue-board", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "component-issue-board") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Add issue to board`,
                    color: "secondary",
                    disabled: !(component?.value?.manageIssues ?? false),
                    onClick: () => {
                        eventBus?.emit("add-issue-to-board", undefined);
                    }
                },
                {
                    icon: "mdi-table-column-plus-after",
                    description: `Add column`,
                    color: "secondary",
                    disabled: !(component?.value?.manageIssueBoards ?? false),
                    onClick: () => {
                        eventBus?.emit("create-issue-board-column", undefined);
                    }
                }
            ],
            [
                {
                    icon: "mdi-cog",
                    description: `Board settings`,
                    color: "secondary",
                    disabled: !(component?.value?.manageIssueBoards ?? false),
                    onClick: () => {
                        eventBus?.emit("edit-issue-board", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "component-versions") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create component version`,
                    color: "secondary",
                    disabled: !(component?.value?.admin ?? false),
                    onClick: () => {
                        eventBus?.emit("create-component-version", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "component-details-labels") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create label`,
                    color: "secondary",
                    disabled: !(component?.value?.manageLabels ?? false),
                    onClick: () => {
                        eventBus?.emit("create-label", undefined);
                    }
                },
                {
                    icon: "mdi-import",
                    description: "Import label",
                    color: "secondary",
                    disabled: !(component?.value?.manageLabels ?? false),
                    onClick: () => {
                        eventBus?.emit("import-label", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "component-details-sync") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create IMS project`,
                    color: "secondary",
                    onClick: () => {
                        eventBus?.emit("create-ims-project", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "component-details-permissions") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create permission`,
                    color: "secondary",
                    onClick: () => {
                        eventBus?.emit("create-permission", undefined);
                    }
                },
                {
                    icon: "mdi-import",
                    description: "Import permission",
                    color: "secondary",
                    onClick: () => {
                        eventBus?.emit("import-permission", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "component-details-interfaces") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create interface specification`,
                    color: "secondary",
                    onClick: () => {
                        eventBus?.emit("create-interface-specification", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "interface-specification-versions") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create interface specification version`,
                    color: "secondary",
                    onClick: () => {
                        eventBus?.emit("create-interface-specification-version", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "component-version-interfaces") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Add interface specification version`,
                    color: "secondary",
                    disabled: !(component?.value?.admin ?? false),
                    onClick: () => {
                        eventBus?.emit("add-interface-specification-version-to-component-version", undefined);
                    }
                }
            ]
        ];
    } else {
        return [];
    }
});
</script>
