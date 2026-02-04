<template>
    <FetchingAutocomplete mode="model" :fetch="searchIMSs" item-title="name" item-value="id">
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { DefaultImsInfoFragment, ImsFilterInput } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";

const searchIMSsQuery = graphql(`
    query searchIMSs($query: String!, $count: Int!, $filter: IMSFilterInput) {
        searchIMSs(query: $query, first: $count, filter: $filter) {
            ...DefaultIMSInfo
        }
    }
`);

const firstIMSsQuery = graphql(`
    query firstIMSs($count: Int!, $filter: IMSFilterInput) {
        imss(first: $count, filter: $filter) {
            nodes {
                ...DefaultIMSInfo
            }
        }
    }
`);

const props = defineProps({
    filter: {
        type: Object as PropType<ImsFilterInput>,
        required: false
    }
});

async function searchIMSs(filter: string, count: number): Promise<DefaultImsInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIMSsQuery, { query, count, filter: props.filter });
            return res.searchIMSs;
        } else {
            const res = await requestThrow(firstIMSsQuery, { count, filter: props.filter });
            return res.imss.nodes;
        }
    }, "Error searching IMSs");
}
</script>
