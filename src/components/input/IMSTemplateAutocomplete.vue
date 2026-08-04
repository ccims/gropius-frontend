<template>
    <FetchingAutocomplete mode="model" :fetch="searchIMSTemplates" label="Template" item-title="name">
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { DefaultImsTemplateInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const searchIMSTemplatesForAutocompleteQuery = graphql(`
    query searchIMSTemplatesForAutocomplete($query: String!, $count: Int!) {
        searchIMSTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {
            ...DefaultIMSTemplateInfo
        }
    }
`);

const firstIMSTemplatesForAutocompleteQuery = graphql(`
    query firstIMSTemplatesForAutocomplete($count: Int!) {
        imsTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {
            nodes {
                ...DefaultIMSTemplateInfo
            }
        }
    }
`);

async function searchIMSTemplates(filter: string, count: number): Promise<DefaultImsTemplateInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIMSTemplatesForAutocompleteQuery, { query, count });
            return res.searchIMSTemplates;
        } else {
            const res = await requestThrow(firstIMSTemplatesForAutocompleteQuery, { count });
            return res.imsTemplates.nodes;
        }
    }, "Error searching IMS templates");
}
</script>
