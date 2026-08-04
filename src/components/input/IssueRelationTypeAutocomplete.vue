<template>
    <FetchingAutocomplete
        mode="model"
        :fetch="searchIssueRelationTypes"
        :dependency="template"
        label="Relation type"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import type { DefaultIssueRelationTypeInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const props = defineProps({
    template: {
        type: String,
        required: false
    }
});

const searchIssueRelationTypesQuery = graphql(`
    query searchIssueRelationTypes($template: ID!, $query: String!, $count: Int!) {
        searchIssueRelationTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {
            ...DefaultIssueRelationTypeInfo
        }
    }
`);

const firstIssueRelationTypesQuery = graphql(`
    query firstIssueRelationTypes($template: ID!, $count: Int!) {
        node(id: $template) {
            ... on IssueTemplate {
                relationTypes(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultIssueRelationTypeInfo
                    }
                }
            }
        }
    }
`);

async function searchIssueRelationTypes(
    filter: string,
    count: number
): Promise<DefaultIssueRelationTypeInfoFragment[]> {
    if (props.template == undefined) {
        return [];
    }
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIssueRelationTypesQuery, { template: props.template!, query, count });
            return res.searchIssueRelationTypes;
        } else {
            const issueTemplate = await queryNodeThrow(firstIssueRelationTypesQuery, "IssueTemplate", {
                template: props.template!,
                count
            });
            return issueTemplate.relationTypes.nodes;
        }
    }, "Error searching issue types");
}
</script>
