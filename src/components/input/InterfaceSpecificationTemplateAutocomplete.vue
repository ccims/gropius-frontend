<template>
    <FetchingAutocomplete
        mode="model"
        :fetch="searchInterfaceSpecificationTemplates"
        label="Template"
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
import {
    DefaultInterfaceSpecificationTemplateInfoFragment,
    InterfaceSpecificationTemplateFilterInput
} from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";

const searchInterfaceSpecificationTemplatesQuery = graphql(`
    query searchInterfaceSpecificationTemplates($query: String!, $count: Int!, $filter: InterfaceSpecificationTemplateFilterInput) {
        searchInterfaceSpecificationTemplates(query: $query, first: $count, filter: $filter) {
            ...DefaultInterfaceSpecificationTemplateInfo
        }
    }
`);

const firstInterfaceSpecificationTemplatesQuery = graphql(`
    query firstInterfaceSpecificationTemplates($count: Int!, $filter: InterfaceSpecificationTemplateFilterInput) {
        interfaceSpecificationTemplates(
            first: $count
            orderBy: [{ field: NAME }]
            filter: $filter
        ) {
            nodes {
                ...DefaultInterfaceSpecificationTemplateInfo
            }
        }
    }
`);

const props = defineProps({
    interfaceSpecificationTemplateFilter: {
        type: Object as PropType<InterfaceSpecificationTemplateFilterInput>,
        required: false
    }
});

async function searchInterfaceSpecificationTemplates(
    filter: string,
    count: number
): Promise<DefaultInterfaceSpecificationTemplateInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchInterfaceSpecificationTemplatesQuery, {
                query,
                count,
                filter: props.interfaceSpecificationTemplateFilter
            });
            return res.searchInterfaceSpecificationTemplates;
        } else {
            const res = await requestThrow(firstInterfaceSpecificationTemplatesQuery, {
                count,
                filter: props.interfaceSpecificationTemplateFilter
            });
            return res.interfaceSpecificationTemplates.nodes;
        }
    }, "Error searching interface specification templates");
}
</script>
