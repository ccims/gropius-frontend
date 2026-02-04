<template>
    <FetchingAutocomplete
        mode="add-context"
        :fetch="searchLabels"
        :context-fetch="searchTrackables"
        :label="label"
        placeholder="Search component/project"
        :item-title="(item: any) => item.name ?? item.title"
        :initial-context="initialContext"
    >
        <template #item="{ props, item: label }">
            <v-list-item :title="label.raw.name" :subtitle="label.raw.description" v-bind="props">
                <template #prepend>
                    <v-icon :color="label.raw.color" class="opacity-100 mr-2" icon="mdi-circle" />
                </template>
            </v-list-item>
        </template>
        <template #context-item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { DefaultLabelInfoFragment, DefaultTrackableInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";

const searchTrackableLabelsQuery = graphql(`
    query searchTrackableLabels($trackable: ID!, $query: String!, $count: Int!) {
        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {
            ...DefaultLabelInfo
        }
    }
`);

const firstTrackableLabelsForExternalQuery = graphql(`
    query firstTrackableLabelsForExternal($trackable: ID!, $count: Int!) {
        node(id: $trackable) {
            ... on Trackable {
                labels(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultLabelInfo
                    }
                }
            }
        }
    }
`);

const searchTrackablesForExternalQuery = graphql(`
    query searchTrackablesForExternal($query: String!, $count: Int!) {
        searchTrackables(query: $query, first: $count) {
            ...DefaultTrackableInfo
        }
    }
`);

const firstTrackablesForExternalQuery = graphql(`
    query firstTrackablesForExternal($count: Int!) {
        trackables(first: $count) {
            nodes {
                ...DefaultTrackableInfo
            }
        }
    }
`);

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Label"
    },
    initialContext: {
        type: Object as PropType<Readonly<DefaultTrackableInfoFragment>>,
        required: false
    }
});

async function searchLabels(
    filter: string,
    count: number,
    context?: DefaultTrackableInfoFragment
): Promise<DefaultLabelInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchTrackableLabelsQuery, { query, count, trackable: context!.id });
            return res.searchLabels;
        } else {
            const node = await queryNodeThrow(firstTrackableLabelsForExternalQuery, "Component", { trackable: context!.id, count });
            return node.labels.nodes;
        }
    }, "Error searching labels");
}

async function searchTrackables(filter: string, count: number): Promise<DefaultTrackableInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchTrackablesForExternalQuery, { query, count });
            return res.searchTrackables;
        } else {
            const res = await requestThrow(firstTrackablesForExternalQuery, { count });
            return res.trackables.nodes;
        }
    }, "Error searching trackables");
}
</script>
