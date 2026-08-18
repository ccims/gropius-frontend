<template>
    <FetchingAutocomplete
        mode="model-multiple"
        :fetch="searchIssueStates"
        :initial-items="initialItems"
        label="Issue states"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props">
                <template #prepend>
                    <v-icon
                        :style="`color: rgb(var(--v-theme-issue-${item.raw.isOpen ? 'open' : 'closed'}))`"
                        class="opacity-100 mr-4"
                        icon="mdi-circle"
                    />
                </template>
            </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import type { DefaultIssueStateInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import type { PropType } from "vue";

defineProps({
    initialItems: {
        type: Array as PropType<DefaultIssueStateInfoFragment[]>,
        required: false,
        default: () => []
    }
});

const searchAllIssueStatesQuery = graphql(`
    query searchAllIssueStates($query: String!, $count: Int!) {
        searchIssueStates(query: $query, first: $count) {
            ...DefaultIssueStateInfo
        }
    }
`);

const firstAllIssueStatesQuery = graphql(`
    query firstAllIssueStates($count: Int!) {
        issueTemplates(first: $count) {
            nodes {
                id
                issueStates(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultIssueStateInfo
                    }
                }
            }
        }
    }
`);

async function searchIssueStates(filter: string, count: number): Promise<DefaultIssueStateInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchAllIssueStatesQuery, { query, count });
            return res.searchIssueStates;
        }
        const res = await requestThrow(firstAllIssueStatesQuery, { count });
        const states = new Map<string, DefaultIssueStateInfoFragment>();
        for (const template of res.issueTemplates.nodes) {
            for (const state of template.issueStates.nodes) {
                states.set(state.id, state);
            }
        }
        return [...states.values()].slice(0, count);
    }, "Error searching issue states");
}
</script>
