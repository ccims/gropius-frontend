<template>
    <FetchingAutocomplete mode="add" :fetch="searchLabels" item-title="name" item-value="id">
        <template #item="{ props, item: label }">
            <v-list-item :title="label.raw.name" :subtitle="label.raw.description" v-bind="props">
                <template #prepend>
                    <v-icon :color="label.raw.color" class="opacity-100 mr-2" icon="mdi-circle" />
                </template>
            </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { DefaultLabelInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";

const props = defineProps({
    issue: {
        type: String,
        required: true
    },
    ignore: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    }
});

const searchLabelsQuery = graphql(`
    query searchLabels($issue: ID!, $query: String!, $count: Int!) {
        searchLabels(
            query: $query
            first: $count
            filter: { trackables: { any: { issues: { any: { id: { eq: $issue } } } } } }
        ) {
            ...DefaultLabelInfo
        }
    }
`);

const firstLabelsQuery = graphql(`
    query firstLabelsForAutocomplete($issue: ID!, $count: Int!) {
        node(id: $issue) {
            id
            ... on Issue {
                trackables {
                    nodes {
                        labels(first: $count, orderBy: [{ field: NAME }]) {
                            nodes {
                                ...DefaultLabelInfo
                            }
                        }
                    }
                }
            }
        }
    }
`);

async function searchLabels(filter: string, count: number): Promise<DefaultLabelInfoFragment[]> {
    const searchRes = await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchLabelsQuery, { issue: props.issue, query, count });
            return res.searchLabels;
        } else {
            const issue = await queryNodeThrow(firstLabelsQuery, "Issue", { issue: props.issue, count });
            return issue.trackables.nodes.flatMap((trackable) => trackable.labels.nodes);
        }
    }, "Error searching labels");
    const searchedLabels = new Map(searchRes.map((label) => [label.id, label]));
    const ignoredLabels = new Set(props.ignore);
    return [...searchedLabels.values()].filter((label) => !ignoredLabels.has(label.id));
}
</script>
