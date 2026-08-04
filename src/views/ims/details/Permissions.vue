<template>
    <PermissionList
        ref="permissionList"
        :permission-entries="permissionEntries"
        :item-manager="itemManager"
        node-name="ims"
        :remove-permission="removePermission"
        :update-permission="updatePermission"
        :create-permission="createPermission"
    >
        <template #import-dialog="{ importedPermission }">
            <ImportIMSPermissionDialog :ims="imsId" @imported-ims-permission="importedPermission" />
        </template>
    </PermissionList>
</template>
<script lang="ts" setup>
import PermissionList, {
    type CreatePermissionFunctionInput,
    type UpdatePermissionFunctionInput
} from "@/components/PermissionList.vue";
import ImportIMSPermissionDialog from "@/components/dialog/ImportIMSPermissionDialog.vue";
import { queryNode, request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import {
    type ImsPermissionOrder,
    type ImsPermissionOrderField,
    type DefaultImsPermissionInfoFragment
} from "@/gql/graphql";
import { ImsPermissionEntry } from "@/gql/enums";
import { ItemManager } from "@/util/itemManager";
import type { IdObject } from "@/util/types";
import { computed, useTemplateRef } from "vue";
import { useRoute } from "vue-router";

const getIMSPermissionListQuery = graphql(`
    query getIMSPermissionList(
        $orderBy: [IMSPermissionOrder!]!
        $count: Int!
        $skip: Int!
        $ims: ID!
        $filter: IMSPermissionFilterInput!
    ) {
        node(id: $ims) {
            __typename
            ... on IMS {
                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
                    nodes {
                        ...DefaultIMSPermissionInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredIMSPermissionListQuery = graphql(`
    query getFilteredIMSPermissionList($query: String!, $count: Int!, $filter: IMSPermissionFilterInput!) {
        searchIMSPermissions(query: $query, first: $count, filter: $filter) {
            ...DefaultIMSPermissionInfo
        }
    }
`);

const removeIMSPermissionFromIMSMutation = graphql(`
    mutation removeIMSPermissionFromIMS($ims: ID!, $imsPermission: ID!) {
        updateIMS(input: { id: $ims, removedPermissions: [$imsPermission] }) {
            __typename
        }
    }
`);

const updateIMSPermissionMutation = graphql(`
    mutation updateIMSPermission($input: UpdateIMSPermissionInput!) {
        updateIMSPermission(input: $input) {
            __typename
        }
    }
`);

const createIMSPermissionMutation = graphql(`
    mutation createIMSPermission($input: CreateIMSPermissionInput!) {
        createIMSPermission(input: $input) {
            imsPermission {
                id
            }
        }
    }
`);

const route = useRoute();

const imsId = computed(() => route.params.ims as string);
const permissionList = useTemplateRef("permissionList");

const permissionEntries = Object.values(ImsPermissionEntry);

class ImsPermissionItemManager extends ItemManager<DefaultImsPermissionInfoFragment, ImsPermissionOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: ImsPermissionOrder[],
        count: number,
        page: number
    ): Promise<[DefaultImsPermissionInfoFragment[], number]> {
        if (filter == undefined) {
            const ims = await queryNode(getIMSPermissionListQuery, "IMS", {
                orderBy,
                count,
                skip: page * count,
                ims: imsId.value,
                filter: permissionList.value?.userFilter ?? {}
            });
            if (ims) {
                return [ims.permissions.nodes, ims.permissions.totalCount];
            }
        } else {
            const res = await request(getFilteredIMSPermissionListQuery, {
                query: filter,
                count,
                filter: {
                    ...permissionList.value?.userFilter,
                    nodesWithPermission: { any: { id: { eq: imsId.value } } }
                }
            });
            if (res) {
                return [res.searchIMSPermissions, res.searchIMSPermissions.length];
            }
        }
        return [[], 0];
    }
}
const itemManager = new ImsPermissionItemManager() as ItemManager<
    DefaultImsPermissionInfoFragment,
    ImsPermissionOrderField
>;

async function removePermission(id: string): Promise<void> {
    await request(removeIMSPermissionFromIMSMutation, { ims: imsId.value, imsPermission: id });
}

async function updatePermission(input: UpdatePermissionFunctionInput<ImsPermissionEntry>): Promise<void> {
    await request(updateIMSPermissionMutation, { input });
}

async function createPermission(input: CreatePermissionFunctionInput<ImsPermissionEntry>): Promise<IdObject> {
    const res = await requestThrow(createIMSPermissionMutation, {
        input: { nodesWithPermission: [imsId.value], ...input }
    });
    return res.createIMSPermission.imsPermission;
}
</script>
