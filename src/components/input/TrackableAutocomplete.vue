<template>
    <FetchingAutocomplete :mode="mode" :fetch="searchTrackables" item-title="name" item-value="id">
        <template #item="{ props, item: trackable }">
            <v-list-item :title="trackable.raw.name" :subtitle="trackable.raw.description" v-bind="props">
                <template #prepend>
                    <v-icon
                        color="primary"
                        class="opacity-100 mr-2"
                        :icon="affectedByIssueIcon(trackable.raw.__typename)"
                    />
                </template>
            </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { DefaultTrackableInfoFragment, TrackableFilterInput } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";
import { affectedByIssueIcon } from "@/util/affectedByIssueUtils";

const searchTrackablesQuery = graphql(`
    query searchTrackables($query: String!, $count: Int!, $filter: TrackableFilterInput) {
        searchTrackables(query: $query, first: $count, filter: $filter) {
            ...DefaultTrackableInfo
        }
    }
`);

const firstTrackablesQuery = graphql(`
    query firstTrackables($count: Int!, $filter: TrackableFilterInput) {
        trackables(first: $count, filter: $filter) {
            nodes {
                ...DefaultTrackableInfo
            }
        }
    }
`);

const props = defineProps({
    ignore: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    },
    filter: {
        type: Object as PropType<TrackableFilterInput>,
        required: false
    },
    mode: {
        type: String as PropType<"add" | "model">,
        required: false,
        default: "add"
    }
});

async function searchTrackables(filter: string, count: number): Promise<DefaultTrackableInfoFragment[]> {
    const searchRes = await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchTrackablesQuery, { query, count, filter: props.filter });
            return res.searchTrackables;
        } else {
            const res = await requestThrow(firstTrackablesQuery, { count, filter: props.filter });
            return res.trackables.nodes;
        }
    }, "Error searching trackables");
    const ignoredTrackables = new Set(props.ignore);
    return searchRes.filter((trackable) => !ignoredTrackables.has(trackable.id));
}
</script>
