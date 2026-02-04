<template>
    <FetchingAutocomplete
        mode="add"
        :fetch="searchRelationTemplates"
        :label="label"
        placeholder="Search relation template"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { RelationTemplateFilterInput, DefaultRelationTemplateInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";

const searchRelationTemplatesQuery = graphql(`
    query searchRelationTemplates($query: String!, $count: Int!, $filter: RelationTemplateFilterInput) {
        searchRelationTemplates(query: $query, first: $count, filter: $filter) {
            ...DefaultRelationTemplateInfo
        }
    }
`);

const getRelationTemplatesQuery = graphql(`
    query getRelationTemplates($count: Int!, $filter: RelationTemplateFilterInput) {
        relationTemplates(first: $count, filter: $filter) {
            nodes {
                ...DefaultRelationTemplateInfo
            }
        }
    }
`);

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Relation template"
    },
    relationTemplateFilter: {
        type: Object as PropType<RelationTemplateFilterInput>,
        required: false
    }
});

async function searchRelationTemplates(filter: string, count: number): Promise<DefaultRelationTemplateInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchRelationTemplatesQuery, {
                query,
                count,
                filter: props.relationTemplateFilter
            });
            return res.searchRelationTemplates;
        } else {
            const res = await requestThrow(getRelationTemplatesQuery, {
                count: count - 1,
                filter: props.relationTemplateFilter
            });
            return res.relationTemplates.nodes;
        }
    }, "Error searching relation templates");
}
</script>
