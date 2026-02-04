<template>
    <FetchingAutocomplete mode="model" :fetch="searchIssueTypes" :dependency="template" label="Type" item-title="name">
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props">
                <template #prepend>
                    <IssueTypeIcon
                        :path="item.raw.iconPath"
                        fill="rgb(var(--v-theme-primary))"
                        class="type-icon mr-2"
                    />
                </template>
            </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { DefaultIssueTypeInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import IssueTypeIcon from "../IssueTypeIcon.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const searchIssueTypesQuery = graphql(`
    query searchIssueTypes($template: ID!, $query: String!, $count: Int!) {
        searchIssueTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {
            ...DefaultIssueTypeInfo
        }
    }
`);

const firstIssueTypesQuery = graphql(`
    query firstIssueTypes($template: ID!, $count: Int!) {
        node(id: $template) {
            ... on IssueTemplate {
                issueTypes(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultIssueTypeInfo
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

async function searchIssueTypes(filter: string, count: number): Promise<DefaultIssueTypeInfoFragment[]> {
    if (props.template == undefined) {
        return [];
    }
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIssueTypesQuery, { template: props.template!, query, count });
            return res.searchIssueTypes;
        } else {
            const node = await queryNodeThrow(firstIssueTypesQuery, "IssueTemplate", {
                template: props.template!,
                count
            });
            return node.issueTypes.nodes;
        }
    }, "Error searching issue types");
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.type-icon {
    width: map.get(settings.$avatar-sizes, "large");
    height: map.get(settings.$avatar-sizes, "large");
}
</style>
