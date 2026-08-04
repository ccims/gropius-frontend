<template>
    <FetchingAutocomplete
        :mode="multiple ? 'model-multiple' : 'model'"
        :fetch="searchIssueTemplates"
        label="Template"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { DefaultIssueTemplateInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const searchIssueTemplatesQuery = graphql(`
    query searchIssueTemplates($query: String!, $count: Int!) {
        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {
            ...DefaultIssueTemplateInfo
        }
    }
`);

const firstIssueTemplatesQuery = graphql(`
    query firstIssueTemplates($count: Int!) {
        issueTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {
            nodes {
                ...DefaultIssueTemplateInfo
            }
        }
    }
`);

defineProps({
    multiple: {
        type: Boolean,
        required: false,
        default: false
    }
});

async function searchIssueTemplates(filter: string, count: number): Promise<DefaultIssueTemplateInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIssueTemplatesQuery, { query, count });
            return res.searchIssueTemplates;
        } else {
            const res = await requestThrow(firstIssueTemplatesQuery, { count });
            return res.issueTemplates.nodes;
        }
    }, "Error searching issue templates");
}
</script>
