<template>
    <FetchingAutocomplete
        mode="add-context"
        :fetch="searchIssues"
        :context-fetch="searchTrackables"
        :label="label"
        placeholder="Search component/project"
        :item-title="(item: any) => item.name ?? item.title"
        :initial-context="initialContext"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.title" :subtitle="generateSubtitle(item.raw)" v-bind="props">
                <template #prepend>
                    <IssueIcon :issue="item.raw" class="issue-icon mr-2" />
                </template>
                <v-tooltip activator="parent" :open-delay="500">
                    {{ item.raw.title }}
                </v-tooltip>
            </v-list-item>
        </template>
        <template #context-item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import type { DefaultIssueInfoFragment, DefaultTrackableInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import IssueIcon from "../IssueIcon.vue";
import type { PropType } from "vue";

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Issue"
    },
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

const searchIssuesQuery = graphql(`
    query searchIssuesForExternal($query: String!, $count: Int!, $trackable: ID!) {
        searchIssues(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {
            ...DefaultIssueInfo
        }
    }
`);

const firstIssuesQuery = graphql(`
    query firstIssuesForExternalAutocomplete($trackable: ID!, $count: Int!) {
        node(id: $trackable) {
            ... on Component {
                issues(first: $count, orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }]) {
                    nodes {
                        ...DefaultIssueInfo
                    }
                }
            }
        }
    }
`);

const searchTrackablesQuery = graphql(`
    query searchTrackablesForExternal($query: String!, $count: Int!) {
        searchTrackables(query: $query, first: $count) {
            ...DefaultTrackableInfo
        }
    }
`);

const firstTrackablesQuery = graphql(`
    query firstTrackablesForExternal($count: Int!) {
        trackables(first: $count) {
            nodes {
                ...DefaultTrackableInfo
            }
        }
    }
`);

function generateSubtitle(issue: DefaultIssueInfoFragment): string {
    return issue.trackables.nodes.map((trackable) => trackable.name).join(", ");
}

async function searchIssues(
    filter: string,
    count: number,
    context?: DefaultTrackableInfoFragment
): Promise<DefaultIssueInfoFragment[]> {
    const searchRes = await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIssuesQuery, { query, count, trackable: context!.id });
            return res.searchIssues;
        } else {
            const component = await queryNodeThrow(firstIssuesQuery, "Component", { trackable: context!.id, count });
            return component.issues.nodes;
        }
    }, "Error searching issues");
    const ignoredIds = new Set(props.ignore);
    return searchRes.filter((item) => !ignoredIds.has(item.id));
}

async function searchTrackables(filter: string, count: number): Promise<DefaultTrackableInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchTrackablesQuery, { query, count });
            return res.searchTrackables;
        } else {
            const res = await requestThrow(firstTrackablesQuery, { count });
            return res.trackables.nodes;
        }
    }, "Error searching trackables");
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.issue-icon {
    width: map.get(settings.$avatar-sizes, "large");
    height: map.get(settings.$avatar-sizes, "large");
}
</style>
