<template>
    <FetchingAutocomplete
        mode="add-context"
        :fetch="searchInterfaceSpecificationVersions"
        :context-fetch="searchInterfaceSpecifications"
        :label="label"
        placeholder="Search interface specification"
        item-title="name"
        :initial-context="initialContext"
    >
        <template #item="{ props, item }">
            <v-list-item v-bind="props" :title="`v${item.raw.version}`" />
        </template>
        <template #context-item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import type {
    DefaultInterfaceSpecificationVersionInfoFragment,
    DefaultInterfaceSpecificationInfoFragment
} from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import type { PropType } from "vue";

const searchInterfaceSpecificationVersionsForAutocompleteQuery = graphql(`
    query searchInterfaceSpecificationVersionsForAutocomplete(
        $query: String!
        $count: Int!
        $interfaceSpecification: ID!
    ) {
        searchInterfaceSpecificationVersions(
            query: $query
            first: $count
            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }
        ) {
            ...DefaultInterfaceSpecificationVersionInfo
        }
    }
`);

const firstInterfaceSpecificationVersionsForAutocompleteQuery = graphql(`
    query firstInterfaceSpecificationVersionsForAutocomplete($interfaceSpecification: ID!, $count: Int!) {
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

const searchInterfaceSpecificationsForAutocompleteQuery = graphql(`
    query searchInterfaceSpecificationsForAutocomplete($query: String!, $count: Int!, $component: ID!) {
        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {
            ...DefaultInterfaceSpecificationInfo
        }
    }
`);

const firstInterfaceSpecificationsForAutocompleteQuery = graphql(`
    query firstInterfaceSpecificationsForAutocomplete($count: Int!, $component: ID!) {
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

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Interface specification version"
    },
    initialContext: {
        type: Object as PropType<Readonly<DefaultInterfaceSpecificationInfoFragment>>,
        required: false
    },
    component: {
        type: String,
        required: true
    }
});

async function searchInterfaceSpecificationVersions(
    filter: string,
    count: number,
    context?: DefaultInterfaceSpecificationInfoFragment
): Promise<DefaultInterfaceSpecificationVersionInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchInterfaceSpecificationVersionsForAutocompleteQuery, {
                query,
                count,
                interfaceSpecification: context!.id
            });
            return res.searchInterfaceSpecificationVersions;
        } else {
            const node = await queryNodeThrow(
                firstInterfaceSpecificationVersionsForAutocompleteQuery,
                "InterfaceSpecification",
                {
                    interfaceSpecification: context!.id,
                    count: count - 1
                }
            );
            return node.versions.nodes;
        }
    }, "Error searching interface specification versions");
}

async function searchInterfaceSpecifications(
    filter: string,
    count: number
): Promise<DefaultInterfaceSpecificationInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchInterfaceSpecificationsForAutocompleteQuery, {
                query,
                count,
                component: props.component
            });
            return res.searchInterfaceSpecifications;
        } else {
            const node = await queryNodeThrow(firstInterfaceSpecificationsForAutocompleteQuery, "Component", {
                count,
                component: props.component
            });
            return node.interfaceSpecifications.nodes;
        }
    }, "Error searching interface specifications");
}
</script>
