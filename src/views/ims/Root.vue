<template>
    <BaseLayoutWithError
        :title-segments="titleSegments"
        :tabs="tabs"
        :right-sidebar-items="rightSidebarItems"
        :left-sidebar-items="leftSidebarItems"
        :data-present="!!ims"
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
import { computed, inject, ref, shallowRef } from "vue";
import { type RouteLocationRaw, useRoute } from "vue-router";
import { eventBusKey } from "@/util/keys";
import { onEvent } from "@/util/eventBus";
import BaseLayoutWithError from "@/components/BaseLayoutWithError.vue";
import { withErrorMessage } from "@/util/withErrorMessage";

const getIMSQuery = graphql(`
    query getIMS($id: ID!) {
        node(id: $id) {
            __typename
            ... on IMS {
                name
                description
                syncTrackables: hasPermission(permission: SYNC_TRACKABLES)
                admin: hasPermission(permission: ADMIN)
            }
        }
    }
`);

const getNamedNodeQuery = graphql(`
    query getNamedNode($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on Named {
                name
            }
        }
    }
`);

const route = useRoute();
const imsId = computed(() => route.params.ims as string);
const imsProjectId = computed(() => route.params.project as string | undefined);
const eventBus = inject(eventBusKey);

const titleSegmentDependency = ref(0);
onEvent("title-segment-changed", () => {
    titleSegmentDependency.value++;
});
const evaluating = shallowRef(false);
const ims = computedAsync(
    async () => {
        if (!imsId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return await withErrorMessage(() => {
            return queryNodeThrow(getIMSQuery, "IMS", { id: imsId.value });
        }, "Error loading IMS");
    },
    null,
    { shallow: false, evaluating }
);

const project = computedAsync(
    async () => {
        if (!imsProjectId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return (await withErrorMessage(() => {
            return queryNodeThrow(getNamedNodeQuery, "Named", { id: imsProjectId.value! });
        }, "Error loading IMS project")) as { id: string; name: string };
    },
    null,
    { shallow: false }
);

function imsPath(name: string): RouteLocationRaw {
    return {
        name,
        params: { ims: imsId.value }
    };
}

function imsProjectPath(name: string): RouteLocationRaw {
    return {
        name,
        params: { ims: imsId.value, project: imsProjectId.value }
    };
}

const titleSegments = computed(() => {
    const segments = [
        { icon: "$ims", path: "/imss" },
        { name: ims.value?.name ?? "", path: imsPath("ims") }
    ];
    const projectValue = project.value;
    if (projectValue != undefined && imsProjectId.value != undefined) {
        segments.push({ name: projectValue.name, path: imsProjectPath("ims-project-general") });
    }
    return segments;
});

const tabs = computed(() => {
    if (imsProjectId.value != undefined) {
        return [];
    }
    return [
        { name: "Projects", path: imsPath("ims") },
        { name: "Details", path: imsPath("ims-details-general"), exact: false }
    ];
});

const leftSidebarItems = computed(() => {
    if (route.path.includes("/details")) {
        return [
            [
                {
                    icon: "mdi-home",
                    name: "General",
                    color: "secondary",
                    to: imsPath("ims-details-general")
                },
                {
                    icon: "mdi-shield-lock",
                    name: "Access",
                    color: "secondary",
                    to: imsPath("ims-details-permissions"),
                    disabled: !(ims?.value?.admin ?? false)
                }
            ],
            [
                {
                    icon: "mdi-alert",
                    name: "Danger",
                    color: "error",
                    to: imsPath("ims-details-danger"),
                    disabled: !(ims?.value?.admin ?? false)
                }
            ]
        ];
    } else if (route.name?.toString().startsWith("ims-project-")) {
        return [
            [
                {
                    icon: "mdi-home",
                    name: "General",
                    color: "secondary",
                    to: imsPath("ims-project-general")
                }
            ],
            [
                {
                    icon: "mdi-alert",
                    name: "Danger",
                    color: "error",
                    to: imsPath("ims-project-danger")
                }
            ]
        ];
    } else {
        return [];
    }
});

const rightSidebarItems = computed(() => {
    if (route.name == "ims-details-permissions") {
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
    } else if (route.name == "ims") {
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
    } else {
        return [];
    }
});
</script>
