<template>
    <FetchingAutocomplete
        mode="add-context"
        :fetch="searchComponentPermissions"
        :context-fetch="searchComponents"
        :label="componentPermission"
        placeholder="Search component"
        :item-title="(item: any) => item.name ?? item.title"
        :initial-context="initialContext"
    >
        <template #item="{ props, item: componentPermission }">
            <v-list-item
                :title="componentPermission.raw.name"
                :subtitle="componentPermission.raw.description"
                v-bind="props"
            />
        </template>
        <template #context-item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { DefaultComponentPermissionInfoFragment, DefaultTrackableInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";

const props = defineProps({
    componentPermission: {
        type: String,
        required: false,
        default: "ComponentPermission"
    },
    initialContext: {
        type: Object as PropType<Readonly<DefaultTrackableInfoFragment>>,
        required: false
    }
});

const searchComponentPermissionsQuery = graphql(`
    query searchComponentPermissionsForExternal($query: String!, $count: Int!, $component: ID!) {
        searchComponentPermissions(
            query: $query
            first: $count
            filter: { nodesWithPermission: { any: { id: { eq: $component } } } }
        ) {
            ...DefaultComponentPermissionInfo
        }
    }
`);

const firstComponentPermissionsQuery = graphql(`
    query firstComponentPermissions($component: ID!, $count: Int!) {
        node(id: $component) {
            ... on Component {
                permissions(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultComponentPermissionInfo
                    }
                }
            }
        }
    }
`);

const searchComponentsQuery = graphql(`
    query searchComponentsForPermissionAutocomplete($query: String!, $count: Int!) {
        searchComponents(query: $query, first: $count) {
            ...DefaultTrackableInfo
        }
    }
`);

const firstComponentsQuery = graphql(`
    query firstComponentsForPermissionAutocomplete($count: Int!) {
        components(first: $count) {
            nodes {
                ...DefaultTrackableInfo
            }
        }
    }
`);

async function searchComponentPermissions(
    filter: string,
    count: number,
    context?: DefaultTrackableInfoFragment
): Promise<DefaultComponentPermissionInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchComponentPermissionsQuery, { query, count, component: context!.id });
            return res.searchComponentPermissions;
        } else {
            const component = await queryNodeThrow(firstComponentPermissionsQuery, "Component", {
                component: context!.id,
                count
            });
            return component.permissions.nodes;
        }
    }, "Error searching component permissions");
}

async function searchComponents(filter: string, count: number): Promise<DefaultTrackableInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchComponentsQuery, { query, count });
            return res.searchComponents;
        } else {
            const res = await requestThrow(firstComponentsQuery, { count });
            return res.components.nodes;
        }
    }, "Error searching components");
}
</script>
