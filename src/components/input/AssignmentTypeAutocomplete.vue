<template>
    <FetchingAutocomplete mode="model" :fetch="searchAssignmentTypes" :dependency="template" label="Assignment type">
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import type { DefaultAssignmentTypeInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const searchAssignmentTypesQuery = graphql(`
    query searchAssignmentTypes($template: ID!, $query: String!, $count: Int!) {
        searchAssignmentTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {
            ...DefaultAssignmentTypeInfo
        }
    }
`);

const firstAssignmentTypesQuery = graphql(`
    query firstAssignmentTypes($template: ID!, $count: Int!) {
        node(id: $template) {
            ... on IssueTemplate {
                assignmentTypes(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultAssignmentTypeInfo
                    }
                }
            }
        }
    }
`);

const props = defineProps({
    template: {
        type: String,
        required: false
    }
});

async function searchAssignmentTypes(filter: string, count: number): Promise<DefaultAssignmentTypeInfoFragment[]> {
    if (props.template == undefined) {
        return [];
    }
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchAssignmentTypesQuery, { template: props.template!, query, count });
            return res.searchAssignmentTypes;
        } else {
            const node = await queryNodeThrow(firstAssignmentTypesQuery, "IssueTemplate", {
                template: props.template!,
                count
            });
            return node.assignmentTypes.nodes;
        }
    }, "Error searching issue types");
}
</script>
