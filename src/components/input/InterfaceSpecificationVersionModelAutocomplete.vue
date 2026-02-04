<template>
    <FetchingAutocomplete
        mode="model"
        :fetch="searchIssueTypes"
        :dependency="interfaceSpecification"
        label="Version"
        item-title="version"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.version" v-bind="props" />
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { DefaultInterfaceSpecificationVersionInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const props = defineProps({
    interfaceSpecification: {
        type: String,
        required: false
    }
});

const searchInterfaceSpecificationVersionsForModelQuery = graphql(`
    query searchInterfaceSpecificationVersionsForModel($query: String!, $count: Int!, $interfaceSpecification: ID!) {
        searchInterfaceSpecificationVersions(
            query: $query
            first: $count
            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }
        ) {
            ...DefaultInterfaceSpecificationVersionInfo
        }
    }
`);

const firstInterfaceSpecificationVersionsForModelQuery = graphql(`
    query firstInterfaceSpecificationVersionsForModel($interfaceSpecification: ID!, $count: Int!) {
        node(id: $interfaceSpecification) {
            ... on InterfaceSpecification {
                versions(first: $count) {
                    nodes {
                        ...DefaultInterfaceSpecificationVersionInfo
                    }
                }
            }
        }
    }
`);

async function searchIssueTypes(
    filter: string,
    count: number
): Promise<DefaultInterfaceSpecificationVersionInfoFragment[]> {
    if (props.interfaceSpecification == undefined) {
        return [];
    }
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchInterfaceSpecificationVersionsForModelQuery, {
                interfaceSpecification: props.interfaceSpecification!,
                query,
                count
            });
            return res.searchInterfaceSpecificationVersions;
        } else {
            const interfaceSpec = await queryNodeThrow(
                firstInterfaceSpecificationVersionsForModelQuery,
                "InterfaceSpecification",
                {
                    interfaceSpecification: props.interfaceSpecification!,
                    count
                }
            );
            return interfaceSpec.versions.nodes;
        }
    }, "Error searching interface specification versions");
}
</script>
