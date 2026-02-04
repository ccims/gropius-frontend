<template>
    <PermissionList
        ref="permissionList"
        :permission-entries="permissionEntries"
        :item-manager="itemManager"
        node-name="component"
        :remove-permission="removePermission"
        :update-permission="updatePermission"
        :create-permission="createPermission"
    >
        <template #import-dialog="{ importedPermission }">
            <ImportComponentPermissionDialog
                :component="componentId"
                @imported-component-permission="importedPermission"
            />
        </template>
    </PermissionList>
</template>
<script lang="ts" setup>
import PermissionList, {
    CreatePermissionFunctionInput,
    UpdatePermissionFunctionInput
} from "@/components/PermissionList.vue";
import ImportComponentPermissionDialog from "@/components/dialog/ImportComponentPermissionDialog.vue";
import { request, queryNode, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import {
    ComponentPermissionEntry,
    ComponentPermissionOrder,
    ComponentPermissionOrderField,
    DefaultComponentPermissionInfoFragment
} from "@/gql/graphql";
import { ItemManager } from "@/util/itemManager";
import { IdObject } from "@/util/types";
import { computed, useTemplateRef } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const componentId = computed(() => route.params.trackable as string);
const permissionList = useTemplateRef("permissionList");

const permissionEntries = Object.values(ComponentPermissionEntry);

const getComponentPermissionListQuery = graphql(`
    query getComponentPermissionList(
        $orderBy: [ComponentPermissionOrder!]!
        $count: Int!
        $skip: Int!
        $component: ID!
        $filter: ComponentPermissionFilterInput!
    ) {
        node(id: $component) {
            ... on Component {
                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
                    nodes {
                        ...DefaultComponentPermissionInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredComponentPermissionListQuery = graphql(`
    query getFilteredComponentPermissionList($query: String!, $count: Int!, $filter: ComponentPermissionFilterInput!) {
        searchComponentPermissions(query: $query, first: $count, filter: $filter) {
            ...DefaultComponentPermissionInfo
        }
    }
`);

const removeComponentPermissionFromComponentMutation = graphql(`
    mutation removeComponentPermissionFromComponent($component: ID!, $componentPermission: ID!) {
        updateComponent(input: { id: $component, removedPermissions: [$componentPermission] }) {
            __typename
        }
    }
`);

const updateComponentPermissionMutation = graphql(`
    mutation updateComponentPermission($input: UpdateComponentPermissionInput!) {
        updateComponentPermission(input: $input) {
            __typename
        }
    }
`);

const createComponentPermissionMutation = graphql(`
    mutation createComponentPermission($input: CreateComponentPermissionInput!) {
        createComponentPermission(input: $input) {
            componentPermission {
                id
            }
        }
    }
`);

class ComponentPermissionItemManager extends ItemManager<
    DefaultComponentPermissionInfoFragment,
    ComponentPermissionOrderField
> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: ComponentPermissionOrder[],
        count: number,
        page: number
    ): Promise<[DefaultComponentPermissionInfoFragment[], number]> {
        if (filter == undefined) {
            const component = await queryNode(getComponentPermissionListQuery, "Component", {
                orderBy,
                count,
                skip: page * count,
                component: componentId.value,
                filter: permissionList.value?.userFilter ?? {}
            });
            if (component) {
                return [component.permissions.nodes, component.permissions.totalCount];
            }
        } else {
            const res = await request(getFilteredComponentPermissionListQuery, {
                query: filter,
                count,
                filter: {
                    ...permissionList.value?.userFilter,
                    nodesWithPermission: { any: { id: { eq: componentId.value } } }
                }
            });
            if (res) {
                return [res.searchComponentPermissions, res.searchComponentPermissions.length];
            }
        }
        return [[], 0];
    }
}

const itemManager = new ComponentPermissionItemManager() as ItemManager<
    DefaultComponentPermissionInfoFragment,
    ComponentPermissionOrderField
>;

async function removePermission(id: string): Promise<void> {
    await request(removeComponentPermissionFromComponentMutation, {
        component: componentId.value,
        componentPermission: id
    });
}

async function updatePermission(input: UpdatePermissionFunctionInput<ComponentPermissionEntry>): Promise<void> {
    await request(updateComponentPermissionMutation, { input });
}

async function createPermission(input: CreatePermissionFunctionInput<ComponentPermissionEntry>): Promise<IdObject> {
    const res = await requestThrow(createComponentPermissionMutation, {
        input: { nodesWithPermission: [componentId.value], ...input }
    });
    return res.createComponentPermission.componentPermission;
}
</script>
