<template>
    <FetchingAutocomplete
        mode="model"
        :fetch="searchIssueTypes"
        :dependency="component"
        label="Interface Specification"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props" />
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import type { DefaultInterfaceSpecificationInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const props = defineProps({
    component: {
        type: String,
        required: false
    }
});

const searchInterfaceSpecificationsQuery = graphql(`
    query searchInterfaceSpecifications($query: String!, $count: Int!, $component: ID!) {
        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {
            ...DefaultInterfaceSpecificationInfo
        }
    }
`);

const firstInterfaceSpecificationsQuery = graphql(`
    query firstInterfaceSpecifications($count: Int!, $component: ID!) {
        node(id: $component) {
            ... on Component {
                interfaceSpecifications(first: $count) {
                    nodes {
                        ...DefaultInterfaceSpecificationInfo
                    }
                }
            }
        }
    }
`);

async function searchIssueTypes(filter: string, count: number): Promise<DefaultInterfaceSpecificationInfoFragment[]> {
    if (props.component == undefined) {
        return [];
    }
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchInterfaceSpecificationsQuery, {
                component: props.component!,
                query,
                count
            });
            return res.searchInterfaceSpecifications;
        } else {
            const component = await queryNodeThrow(firstInterfaceSpecificationsQuery, "Component", {
                component: props.component!,
                count
            });
            return component.interfaceSpecifications.nodes;
        }
    }, "Error searching interface specifications");
}
</script>
