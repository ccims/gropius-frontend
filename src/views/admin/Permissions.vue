<template>
    <PermissionList
        ref="permissionList"
        :permission-entries="permissionEntries"
        :item-manager="itemManager"
        node-name="global"
        :remove-permission="deletePermission"
        :update-permission="updatePermission"
        :create-permission="createPermission"
    >
    </PermissionList>
</template>
<script lang="ts" setup>
import { ItemManager } from "@/util/itemManager";
import PermissionList, {
    CreatePermissionFunctionInput,
    UpdatePermissionFunctionInput
} from "@/components/PermissionList.vue";
import { request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import {
    PermissionEntry,
    GlobalPermissionOrderField,
    DefaultGlobalPermissionInfoFragment,
    GlobalPermissionOrder
} from "@/gql/graphql";
import { IdObject } from "@/util/types";
import { computed, useTemplateRef } from "vue";
import { useRoute } from "vue-router";

const getGlobalPermissionListQuery = graphql(`
    query getGlobalPermissionList(
        $orderBy: [GlobalPermissionOrder!]!
        $count: Int!
        $skip: Int!
        $filter: GlobalPermissionFilterInput
    ) {
        globalPermissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
            nodes {
                ...DefaultGlobalPermissionInfo
            }
            totalCount
        }
    }
`);

const getFilteredGlobalPermissionListQuery = graphql(`
    query getFilteredGlobalPermissionList($query: String!, $count: Int!, $filter: GlobalPermissionFilterInput!) {
        searchGlobalPermissions(query: $query, first: $count, filter: $filter) {
            ...DefaultGlobalPermissionInfo
        }
    }
`);

const deleteGlobalPermissionMutation = graphql(`
    mutation deleteGlobalPermission($globalPermission: ID!) {
        deleteGlobalPermission(input: { id: $globalPermission }) {
            __typename
        }
    }
`);

const updateGlobalPermissionMutation = graphql(`
    mutation updateGlobalPermission($input: UpdateGlobalPermissionInput!) {
        updateGlobalPermission(input: $input) {
            __typename
        }
    }
`);

const createGlobalPermissionMutation = graphql(`
    mutation createGlobalPermission($input: CreateGlobalPermissionInput!) {
        createGlobalPermission(input: $input) {
            globalPermission {
                id
            }
        }
    }
`);

const route = useRoute();

const globalId = computed(() => route.params.trackable as string);
const permissionList = useTemplateRef("permissionList");

const permissionEntries = Object.values(PermissionEntry);

class PermissionItemManager extends ItemManager<DefaultGlobalPermissionInfoFragment, GlobalPermissionOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: GlobalPermissionOrder[],
        count: number,
        page: number
    ): Promise<[DefaultGlobalPermissionInfoFragment[], number]> {
        if (filter == undefined) {
            const res = await request(getGlobalPermissionListQuery, {
                orderBy,
                count,
                skip: page * count,
                filter: permissionList.value?.userFilter ?? {}
            });
            if (res) {
                return [res.globalPermissions.nodes, res.globalPermissions.totalCount];
            }
        } else {
            const res = await request(getFilteredGlobalPermissionListQuery, {
                query: filter,
                count,
                filter: permissionList.value?.userFilter ?? {}
            });
            if (res) {
                return [res.searchGlobalPermissions, res.searchGlobalPermissions.length];
            }
        }
        return [[], 0];
    }
}

const itemManager = new PermissionItemManager() as ItemManager<
    DefaultGlobalPermissionInfoFragment,
    GlobalPermissionOrderField
>;

async function deletePermission(id: string): Promise<void> {
    await request(deleteGlobalPermissionMutation, { globalPermission: id });
}

async function updatePermission(input: UpdatePermissionFunctionInput<PermissionEntry>): Promise<void> {
    await request(updateGlobalPermissionMutation, { input });
}

async function createPermission(input: CreatePermissionFunctionInput<PermissionEntry>): Promise<IdObject> {
    const res = await requestThrow(createGlobalPermissionMutation, {
        input: { ...input }
    });
    return res.createGlobalPermission.globalPermission;
}
</script>
