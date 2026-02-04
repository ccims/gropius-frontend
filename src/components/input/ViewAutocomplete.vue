<template>
    <FetchingAutocomplete mode="model" :fetch="searchViews" :label="label" item-title="name">
        <template #item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.name" :subtitle="item.raw.description" />
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { DefaultViewInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const searchViewsQuery = graphql(`
    query searchViews($project: ID!, $query: String!, $count: Int!) {
        searchViews(query: $query, first: $count, filter: { project: { id: { eq: $project } } }) {
            ...DefaultViewInfo
        }
    }
`);

const firstViewsQuery = graphql(`
    query firstViews($project: ID!, $count: Int!) {
        node(id: $project) {
            ... on Project {
                views(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultViewInfo
                    }
                }
            }
        }
    }
`);

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "View"
    },
    project: {
        type: String,
        required: true
    }
});

async function searchViews(filter: string, count: number): Promise<DefaultViewInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchViewsQuery, { query, count, project: props.project });
            return res.searchViews;
        } else {
            const node = await queryNodeThrow(firstViewsQuery, "Project", { project: props.project, count: count - 1 });
            return node.views.nodes;
        }
    }, "Error searching views");
}
</script>
