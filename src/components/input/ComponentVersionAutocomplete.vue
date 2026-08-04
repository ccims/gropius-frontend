<template>
    <FetchingAutocomplete
        mode="add-context"
        :fetch="searchComponentVersions"
        :context-fetch="searchComponents"
        :label="label"
        placeholder="Search component"
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
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import type {
    ComponentFilterInput,
    DefaultComponentVersionInfoFragment,
    DefaultTrackableInfoFragment
} from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import type { PropType } from "vue";

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Component version"
    },
    initialContext: {
        type: Object as PropType<Readonly<DefaultTrackableInfoFragment>>,
        required: false
    },
    componentFilter: {
        type: Object as PropType<ComponentFilterInput>,
        required: false
    }
});

const searchComponentVersionsQuery = graphql(`
    query searchComponentVersions($query: String!, $count: Int!, $component: ID!) {
        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {
            ...DefaultComponentVersionInfo
        }
    }
`);

const firstComponentVersionsQuery = graphql(`
    query firstComponentVersions($component: ID!, $count: Int!) {
        node(id: $component) {
            id
            ... on Component {
                versions(first: $count) {
                    nodes {
                        ...DefaultComponentVersionInfo
                    }
                }
            }
        }
    }
`);

const searchComponentsQuery = graphql(`
    query searchComponentsForVersionAutocomplete($query: String!, $count: Int!, $filter: ComponentFilterInput) {
        searchComponents(query: $query, first: $count, filter: $filter) {
            ...DefaultTrackableInfo
        }
    }
`);

const firstComponentsQuery = graphql(`
    query firstComponentsForVersionAutocomplete($count: Int!, $filter: ComponentFilterInput) {
        components(first: $count, filter: $filter) {
            nodes {
                ...DefaultTrackableInfo
            }
        }
    }
`);

async function searchComponentVersions(
    filter: string,
    count: number,
    context?: DefaultTrackableInfoFragment
): Promise<DefaultComponentVersionInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchComponentVersionsQuery, { query, count, component: context!.id });
            return res.searchComponentVersions;
        } else {
            const component = await queryNodeThrow(firstComponentVersionsQuery, "Component", {
                component: context!.id,
                count: count - 1
            });
            return component.versions.nodes;
        }
    }, "Error searching component versions");
}

async function searchComponents(filter: string, count: number): Promise<DefaultTrackableInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchComponentsQuery, { query, count, filter: props.componentFilter });
            return res.searchComponents;
        } else {
            const res = await requestThrow(firstComponentsQuery, { count, filter: props.componentFilter });
            return res.components.nodes;
        }
    }, "Error searching components");
}
</script>
