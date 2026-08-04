<template>
    <BaseLayoutWithError
        :title-segments="titleSegments"
        :tabs="tabs"
        :right-sidebar-items="rightSidebarItems"
        :left-sidebar-items="leftSidebarItems"
        :data-present="!!issueTemplate"
        :evaluating="evaluating"
    >
        <template #content>
            <router-view />
        </template>
    </BaseLayoutWithError>
</template>

<script lang="ts" setup>
import BaseLayoutWithError from "@/components/BaseLayoutWithError.vue";
import { queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { computedAsync } from "@vueuse/core";
import { computed, ref, shallowRef } from "vue";
import { type RouteLocationRaw, useRoute } from "vue-router";
import { withErrorMessage } from "@/util/withErrorMessage";
import { onEvent } from "@/util/eventBus";
import { useAppStore } from "@/store/app";

const getIssueTemplateQuery = graphql(`
    query getIssueTemplate($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IssueTemplate {
                name
                description
            }
        }
    }
`);

const route = useRoute();
const store = useAppStore();
const issueTemplateId = computed(() => route.params.issueTemplate as string);

const titleSegmentDependency = ref(0);
onEvent("title-segment-changed", () => {
    titleSegmentDependency.value++;
});

const evaluating = shallowRef(false);
const issueTemplate = computedAsync(
    async () => {
        if (!issueTemplateId.value) {
            return null;
        }
        titleSegmentDependency.value;
        return await withErrorMessage(
            () => queryNodeThrow(getIssueTemplateQuery, "IssueTemplate", { id: issueTemplateId.value }),
            "Error loading issue template"
        );
    },
    null,
    { shallow: false, evaluating }
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
                name: "Field Specs",
                color: "secondary",
                to: issueTemplatePath("issue-template-details-field-specifications")
            }
        ],
        [
            {
                icon: "mdi-alert",
                name: "Danger",
                color: "error",
                to: issueTemplatePath("issue-template-details-danger"),
                disabled: !(store.user?.canCreateTemplates ?? false)
            }
        ]
    ];
});

const rightSidebarItems = computed(() => {
    return [];
});
</script>
