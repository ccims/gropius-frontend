<template>
    <FetchingAutocomplete
        :mode="multiple ? 'model-multiple' : 'model'"
        :fetch="searchComponentTemplates"
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
import type { DefaultComponentTemplateInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const searchComponentTemplatesForAutocompleteQuery = graphql(`
    query searchComponentTemplatesForAutocomplete($query: String!, $count: Int!) {
        searchComponentTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {
            ...DefaultComponentTemplateInfo
        }
    }
`);

const firstComponentTemplatesForAutocompleteQuery = graphql(`
    query firstComponentTemplatesForAutocomplete($count: Int!) {
        componentTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {
            nodes {
                ...DefaultComponentTemplateInfo
            }
        }
    }
`);

defineProps({
    multiple: {
        type: Boolean,
        required: false,
        default: false
    }
});

async function searchComponentTemplates(
    filter: string,
    count: number
): Promise<DefaultComponentTemplateInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchComponentTemplatesForAutocompleteQuery, { query, count });
            return res.searchComponentTemplates;
        } else {
            const res = await requestThrow(firstComponentTemplatesForAutocompleteQuery, { count });
            return res.componentTemplates.nodes;
        }
    }, "Error searching component templates");
}
</script>
