<template>
    <BaseLayoutWithError
        :title-segments="titleSegments"
        :tabs="tabs"
        :right-sidebar-items="rightSidebarItems"
        :left-sidebar-items="leftSidebarItems"
        :data-present="!!project"
        :evaluating="evaluating"
    >
        <template #content>
            <router-view />
        </template>
    </BaseLayoutWithError>
</template>

<script lang="ts" setup>
import { queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { computedAsync } from "@vueuse/core";
import { computed, inject, provide, ref, shallowRef } from "vue";
import { type RouteLocationRaw, useRoute } from "vue-router";
import { eventBusKey, trackableKey } from "@/util/keys";
import { onEvent } from "@/util/eventBus";
import BaseLayoutWithError from "@/components/BaseLayoutWithError.vue";
import { withErrorMessage } from "@/util/withErrorMessage";

const getProjectQuery = graphql(`
    query getProject($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on Project {
                __typename
                name
                description
                ...OpenIssueCount
                createIssues: hasPermission(permission: CREATE_ISSUES)
                manageLabels: hasPermission(permission: MANAGE_LABELS)
                manageComponents: hasPermission(permission: MANAGE_COMPONENTS)
                manageIssues: hasPermission(permission: MANAGE_ISSUES)
                manageIssueBoards: hasPermission(permission: MANAGE_ISSUE_BOARDS)
                manageIMS: hasPermission(permission: MANAGE_IMS)
                manageViews: hasPermission(permission: MANAGE_VIEWS)
                admin: hasPermission(permission: ADMIN)
            }
        }
    }
`);

const getIssueBoardNameQuery = graphql(`
    query getIssueBoardNameProject($id: ID!) {
        node(id: $id) {
            id
            ... on Named {
                name
            }
        }
    }
`);

const route = useRoute();
const projectId = computed(() => route.params.trackable as string);
const issueBoardId = computed(() => route.params.board as string | undefined);
const eventBus = inject(eventBusKey);

const titleSegmentDependency = ref(0);
onEvent("title-segment-changed", () => {
    titleSegmentDependency.value++;
});
const evaluating = shallowRef(false);
const project = computedAsync(
    async () => {
        if (!projectId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return (await withErrorMessage(
            () => queryNodeThrow(getProjectQuery, "Project", { id: projectId.value }),
            "Error loading project"
        ))!;
    },
    null,
    { shallow: false, evaluating }
);

const issueBoard = computedAsync(
    async () => {
        if (!issueBoardId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return (await withErrorMessage(
            () => queryNodeThrow(getIssueBoardNameQuery, "IssueBoard", { id: issueBoardId.value! }),
            "Error loading issue board"
        )) as { id: string; name: string };
    },
    null,
    { shallow: false }
);

provide(trackableKey, project);

function projectPath(name: string): RouteLocationRaw {
    return {
        name,
        params: { trackable: projectId.value }
    };
}

const titleSegments = computed(() => {
    const segments = [
        { icon: "$project", path: "/projects" },
        { name: project.value?.name ?? "", path: projectPath("") }
    ];
    if (issueBoard.value != undefined && issueBoardId.value != undefined) {
        segments.push({ name: issueBoard.value.name, path: projectPath("project-issue-boards") });
    }
    return segments;
});

const tabs = computed(() => [
    { name: "Home", path: projectPath("project") },
    { name: "Details", path: projectPath("project-details-general"), exact: false },
    { name: "Issues", path: projectPath("project-issues"), exact: false },
    { name: "Component Issues", path: projectPath("project-component-issues"), exact: false },
    { name: "Boards", path: projectPath("project-issue-boards"), exact: false }
]);

const leftSidebarItems = computed(() => {
    if (route.path.includes("/details")) {
        return [
            [
                {
                    icon: "mdi-home",
                    name: "General",
                    color: "secondary",
                    to: projectPath("project-details-general")
                },
                {
                    icon: "mdi-animation",
                    name: "Views",
                    color: "secondary",
                    to: projectPath("project-details-views")
                },
                {
                    icon: "mdi-label",
                    name: "Labels",
                    color: "secondary",
                    to: projectPath("project-details-labels")
                },
                {
                    icon: "$ims",
                    name: "Syncs to",
                    color: "secondary",
                    to: projectPath("project-details-sync"),
                    disabled: !(project?.value?.manageIMS ?? false)
                },
                {
                    icon: "mdi-shield-lock",
                    name: "Access",
                    color: "secondary",
                    to: projectPath("project-details-permissions"),
                    disabled: !(project?.value?.admin ?? false)
                }
            ],
            [
                {
                    icon: "mdi-alert",
                    name: "Danger",
                    color: "error",
                    to: projectPath("project-details-danger"),
                    disabled: !(project?.value?.admin ?? false)
                }
            ]
        ];
    } else {
        return [];
    }
});

const rightSidebarItems = computed(() => {
    if (route.name == "project-issue-boards") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create issue board`,
                    color: "secondary",
                    disabled: !(project?.value?.manageIssueBoards ?? false),
                    onClick: () => {
                        eventBus?.emit("create-issue-board", undefined);
                    }
                }
            ]
        ];
    }
    if (route.name == "project-issue-board") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Add issue to board`,
                    color: "secondary",
                    disabled: !(project?.value?.manageIssues ?? false),
                    onClick: () => {
                        eventBus?.emit("add-issue-to-board", undefined);
                    }
                },
                {
                    icon: "mdi-table-column-plus-after",
                    description: `Add column`,
                    color: "secondary",
                    disabled: !(project?.value?.manageIssueBoards ?? false),
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
                    disabled: !(project?.value?.manageIssueBoards ?? false),
                    onClick: () => {
                        eventBus?.emit("edit-issue-board", undefined);
                    }
                }
            ]
        ];
    }
    if (route.name == "project-issues" || route.name == "project-issue") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create issue`,
                    color: "secondary",
                    disabled: !(project?.value?.createIssues ?? false),
                    onClick: () => {
                        eventBus?.emit("create-issue", undefined);
                    }
                },
                {
                    icon: "mdi-import",
                    description: "Import issue",
                    color: "secondary",
                    disabled: !(project?.value?.manageIssues ?? false),
                    onClick: () => {
                        eventBus?.emit("import-issue", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "project") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: "Add component version",
                    color: "secondary",
                    disabled: !(project?.value?.manageComponents ?? false),
                    onClick: () => {
                        eventBus?.emit("add-component-version-to-project", undefined);
                    }
                },
                {
                    icon: "mdi-auto-fix",
                    description: "Layout graph",
                    color: "secondary",
                    onClick: () => {
                        eventBus?.emit("layout-component-graph", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "project-details-views") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create view`,
                    color: "secondary",
                    disabled: !(project?.value?.manageViews ?? false),
                    onClick: () => {
                        eventBus?.emit("create-view", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "project-details-labels") {
        return [
            [
                {
                    icon: "mdi-plus",
                    description: `Create label`,
                    color: "secondary",
                    disabled: !(project?.value?.manageLabels ?? false),
                    onClick: () => {
                        eventBus?.emit("create-label", undefined);
                    }
                },
                {
                    icon: "mdi-import",
                    description: "Import label",
                    color: "secondary",
                    disabled: !(project?.value?.manageLabels ?? false),
                    onClick: () => {
                        eventBus?.emit("import-label", undefined);
                    }
                }
            ]
        ];
    } else if (route.name == "project-details-sync") {
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
    } else if (route.name == "project-details-permissions") {
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
    } else {
        return [];
    }
});
</script>
