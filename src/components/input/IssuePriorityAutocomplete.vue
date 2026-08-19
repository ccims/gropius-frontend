<template>
    <FetchingAutocomplete
        mode="model"
        :fetch="searchIssuePriorities"
        :dependency="template"
        label="Priority"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props">
                <template v-if="item.raw.iconPath" #prepend>
                    <SvgWrapper :path="item.raw.iconPath" class="priority-icon mr-4" />
                </template>
            </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import type { DefaultIssuePriorityInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import SvgWrapper from "../SvgWrapper.vue";

const searchIssuePrioritiesQuery = graphql(`
    query searchIssuePriorities($template: ID!, $query: String!, $count: Int!) {
        searchIssuePriorities(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {
            ...DefaultIssuePriorityInfo
        }
    }
`);

const firstIssuePrioritiesQuery = graphql(`
    query firstIssuePriorities($template: ID!, $count: Int!) {
        node(id: $template) {
            ... on IssueTemplate {
                issuePriorities(first: $count, orderBy: [{ field: VALUE }, { field: NAME }]) {
                    nodes {
                        ...DefaultIssuePriorityInfo
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

async function searchIssuePriorities(filter: string, count: number): Promise<DefaultIssuePriorityInfoFragment[]> {
    if (props.template == undefined) {
        return [];
    }
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIssuePrioritiesQuery, { template: props.template!, query, count });
            return res.searchIssuePriorities;
        } else {
            const node = await queryNodeThrow(firstIssuePrioritiesQuery, "IssueTemplate", {
                template: props.template!,
                count
            });
            return node.issuePriorities.nodes;
        }
    }, "Error searching issue priorities");
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.priority-icon {
    width: map.get(settings.$avatar-sizes, "large");
    height: map.get(settings.$avatar-sizes, "large");
    color: rgb(var(--v-theme-primary));
}
</style>
