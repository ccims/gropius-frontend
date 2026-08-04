<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="issueTemplate != undefined">
        <DetailCompartment name="General">
            <div class="field-group">
                <div class="field-label text-medium-emphasis">Name</div>
                <div class="field-value">{{ issueTemplate.name }}</div>
            </div>
            <div class="field-group">
                <div class="field-label text-medium-emphasis">Description</div>
                <div class="field-value">{{ issueTemplate.description || "No description provided" }}</div>
            </div>
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import { queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { useRoute } from "vue-router";

const getIssueTemplateGeneralDetailsQuery = graphql(`
    query getIssueTemplateGeneralDetails($id: ID!) {
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
const issueTemplateId = computed(() => route.params.issueTemplate as string);

const issueTemplate = computedAsync(
    async () => {
        if (!issueTemplateId.value) {
            return null;
        }
        return await withErrorMessage(
            () => queryNodeThrow(getIssueTemplateGeneralDetailsQuery, "IssueTemplate", { id: issueTemplateId.value }),
            "Error loading issue template details"
        );
    },
    null,
    { shallow: false }
);
</script>

<style scoped lang="scss">
.field-group {
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
}

.field-label {
    font-size: 12px;
    margin-bottom: 4px;
}

.field-value {
    font-size: 16px;
}
</style>
