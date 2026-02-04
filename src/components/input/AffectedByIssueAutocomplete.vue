<template>
    <FetchingAutocomplete
        mode="add-context"
        :fetch="searchAffected"
        :context-fetch="searchTrackables"
        placeholder="Search component/project"
        :item-title="(item: any) => item.name ?? item.title"
        item-value="id"
        :initial-context="initialContext"
    >
        <template #item="{ props, item }">
            <v-list-item
                v-bind="props"
                :title="affectedByIssueName(item.raw)"
                :subtitle="affectedByIssueDescription(item.raw)"
            >
                <template #prepend>
                    <v-icon color="primary" class="opacity-100 mr-2" :icon="affectedByIssueIcon(item.raw.__typename)" />
                </template>
            </v-list-item>
        </template>
        <template #context-item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.name" :subtitle="item.raw.description">
                <template #prepend>
                    <v-icon color="primary" class="opacity-100 mr-2" :icon="affectedByIssueIcon(item.raw.__typename)" />
                </template>
            </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { DefaultAffectedByIssueInfoFragment, DefaultTrackableInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";
import {
    affectedByIssueDescription,
    affectedByIssueIcon,
    affectedByIssueName,
    expandSearchResult
} from "@/util/affectedByIssueUtils";

const searchAffectedByIssuesForAutocompleteQuery = graphql(`
    query searchAffectedByIssuesForAutocomplete($query: String!, $count: Int!, $trackable: ID!, $sublistCount: Int) {
        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {
            ...DetailedAffectedByIssueInfo
        }
    }
`);

const firstComponentVersionsForAutocompleteQuery = graphql(`
    query firstComponentVersionsForAutocomplete($component: ID!, $count: Int!) {
        node(id: $component) {
            ... on Component {
                versions(first: $count) {
                    nodes {
                        ...DefaultComponentVersionInfo
                    }
                }
            }
        }
    }
`);

const searchTrackablesForAutocompleteQuery = graphql(`
    query searchTrackablesForAutocomplete($query: String!, $count: Int!) {
        searchTrackables(query: $query, first: $count) {
            ...DefaultTrackableInfo
        }
    }
`);

const firstTrackablesForAutocompleteQuery = graphql(`
    query firstTrackablesForAutocomplete($count: Int!) {
        trackables(first: $count) {
            nodes {
                ...DefaultTrackableInfo
            }
        }
    }
`);

const props = defineProps({
    initialContext: {
        type: Object as PropType<Readonly<DefaultTrackableInfoFragment>>,
        required: false
    },
    ignore: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    }
});

async function searchAffected(
    filter: string,
    count: number,
    context?: DefaultTrackableInfoFragment
): Promise<DefaultAffectedByIssueInfoFragment[]> {
    const searchRes = await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchAffectedByIssuesForAutocompleteQuery, {
                query,
                count,
                trackable: context!.id,
                sublistCount: 100
            });
            return expandSearchResult(res.searchAffectedByIssues);
        } else if (context!.__typename == "Component") {
            const node = await queryNodeThrow(firstComponentVersionsForAutocompleteQuery, "Component", { component: context!.id, count: count - 1 });
            return [context!, ...node.versions.nodes];
        } else {
            return [context!];
        }
    }, "Error searching affectable entities");
    const ignoredIds = new Set(props.ignore);
    return searchRes.filter((item) => !ignoredIds.has(item.id));
}

async function searchTrackables(filter: string, count: number): Promise<DefaultTrackableInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchTrackablesForAutocompleteQuery, { query, count });
            return res.searchTrackables;
        } else {
            const res = await requestThrow(firstTrackablesForAutocompleteQuery, { count });
            return res.trackables.nodes;
        }
    }, "Error searching trackables");
}
</script>
