<template>
    <FetchingAutocomplete
        mode="model"
        :fetch="searchIssueStates"
        :dependency="template"
        label="State"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props">
                <template #prepend>
                    <v-icon
                        :color="item.raw.isOpen ? 'issue-open' : 'issue-closed'"
                        class="opacity-100 mr-4"
                        icon="mdi-circle"
                    />
                </template>
            </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { DefaultIssueStateInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const props = defineProps({
    template: {
        type: String,
        required: false
    }
});

const searchIssueStatesQuery = graphql(`
    query searchIssueStates($template: ID!, $query: String!, $count: Int!) {
        searchIssueStates(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {
            ...DefaultIssueStateInfo
        }
    }
`);

const firstIssueStatesQuery = graphql(`
    query firstIssueStates($template: ID!, $count: Int!) {
        node(id: $template) {
            ... on IssueTemplate {
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
    if (props.template == undefined) {
        return [];
    }
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIssueStatesQuery, { template: props.template!, query, count });
            return res.searchIssueStates;
        } else {
            const issueTemplate = await queryNodeThrow(firstIssueStatesQuery, "IssueTemplate", {
                template: props.template!,
                count
            });
            return issueTemplate.issueStates.nodes;
        }
    }, "Error searching issue states");
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.state-icon {
    width: map.get(settings.$avatar-sizes, "large");
    height: map.get(settings.$avatar-sizes, "large");
}
</style>
