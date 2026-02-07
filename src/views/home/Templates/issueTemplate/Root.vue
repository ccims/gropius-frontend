<template>
    <BaseLayout
        :title-segments="titleSegments"
        :tabs="tabs"
        :right-sidebar-items="rightSidebarItems"
        :left-sidebar-items="leftSidebarItems"
    >
        <template #content>
            <router-view />
        </template>
    </BaseLayout>
</template>

<script lang="ts" setup>
import BaseLayout from "@/components/BaseLayout.vue";
import { NodeReturnType, useClient } from "@/graphql/client";
import { computedAsync } from "@vueuse/core";
import { computed, ref } from "vue";
import { RouteLocationRaw, useRoute } from "vue-router";
import { withErrorMessage } from "@/util/withErrorMessage";
import { inject } from "vue";
import { eventBusKey } from "@/util/keys";
import { onEvent } from "@/util/eventBus";

type IssueTemplate = NodeReturnType<"getIssueTemplate", "IssueTemplate">;

const client = useClient();
const route = useRoute();
const issueTemplateId = computed(() => route.params.issueTemplate as string);
const eventBus = inject(eventBusKey);

const titleSegmentDependency = ref(0);
onEvent("title-segment-changed", () => {
    titleSegmentDependency.value++;
});

const issueTemplate = computedAsync(
    async () => {
        if (!issueTemplateId.value) {
            return null;
        }
        titleSegmentDependency.value;
        const res = await withErrorMessage(
            () => client.getIssueTemplate({ id: issueTemplateId.value }),
            "Error loading issue template"
        );
        return res.node as IssueTemplate;
    },
    null,
    { shallow: false }
);

function issueTemplatePath(name: string): RouteLocationRaw {
    return {
        name,
        params: { issueTemplate: issueTemplateId.value }
    };
}

const titleSegments = computed(() => {
    return [
        { icon: "mdi-file-document-outline", path: "/templates" },
        { name: issueTemplate.value?.name ?? "", path: issueTemplatePath("issue-template-details-general") }
    ];
});

const tabs = computed(() => {
    return [];
});

const leftSidebarItems = computed(() => {
    return [
        [
            {
                icon: "mdi-home",
                name: "General",
                color: "secondary",
                to: issueTemplatePath("issue-template-details-general")
            },
            {
                icon: "mdi-format-list-bulleted-type",
                name: "Issue Attributes",
                color: "secondary",
                to: issueTemplatePath("issue-template-details-issue-attributes")
            },
            {
                icon: "mdi-link-variant",
                name: "Linkage Attributes",
                color: "secondary",
                to: issueTemplatePath("issue-template-details-linkage-attributes")
            },
            {
                icon: "mdi-form-textbox",
                name: "Field Specifications",
                color: "secondary",
                to: issueTemplatePath("issue-template-details-field-specifications")
            }
        ]
    ];
});

const rightSidebarItems = computed(() => {
    return [];
});
</script>
