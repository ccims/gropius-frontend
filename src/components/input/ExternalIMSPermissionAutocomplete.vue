<template>
    <FetchingAutocomplete
        mode="add-context"
        :fetch="searchIMSPermissions"
        :context-fetch="searchIMSs"
        :label="imsPermission"
        placeholder="Search ims"
        :item-title="(item: any) => item.name ?? item.title"
        :initial-context="initialContext"
    >
        <template #item="{ props, item: imsPermission }">
            <v-list-item :title="imsPermission.raw.name" :subtitle="imsPermission.raw.description" v-bind="props" />
        </template>
        <template #context-item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { DefaultImsInfoFragment, DefaultImsPermissionInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";

const props = defineProps({
    imsPermission: {
        type: String,
        required: false,
        default: "IMSPermission"
    },
    initialContext: {
        type: Object as PropType<Readonly<DefaultImsInfoFragment>>,
        required: false
    }
});

const searchIMSPermissionsQuery = graphql(`
    query searchIMSPermissionsForExternal($query: String!, $count: Int!, $ims: ID!) {
        searchIMSPermissions(
            query: $query
            first: $count
            filter: { nodesWithPermission: { any: { id: { eq: $ims } } } }
        ) {
            ...DefaultIMSPermissionInfo
        }
    }
`);

const firstIMSPermissionsQuery = graphql(`
    query firstIMSPermissions($ims: ID!, $count: Int!) {
        node(id: $ims) {
            ... on IMS {
                permissions(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultIMSPermissionInfo
                    }
                }
            }
        }
    }
`);

const searchIMSsQuery = graphql(`
    query searchIMSsForExternal($query: String!, $count: Int!) {
        searchIMSs(query: $query, first: $count) {
            ...DefaultIMSInfo
        }
    }
`);

async function searchIMSPermissions(
    filter: string,
    count: number,
    context?: DefaultImsInfoFragment
): Promise<DefaultImsPermissionInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIMSPermissionsQuery, { query, count, ims: context!.id });
            return res.searchIMSPermissions;
        } else {
            const ims = await queryNodeThrow(firstIMSPermissionsQuery, "IMS", { ims: context!.id, count });
            return ims.permissions.nodes;
        }
    }, "Error searching ims permissions");
}

async function searchIMSs(filter: string, count: number): Promise<DefaultImsInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIMSsQuery, { query, count });
            return res.searchIMSs;
        } else {
            return [];
        }
    }, "Error searching IMSs");
}
</script>
