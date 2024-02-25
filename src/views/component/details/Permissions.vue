<template>
    <PermissionList
        :permission-entries="permissionEntries"
        :item-manager="itemManager"
        node-name="component"
        :remove-permission="removePermission"
        :update-permission="updatePermission"
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
import { ItemManager } from "@/components/PaginatedList.vue";
import PermissionList, {
    PermissionUpdateFunction,
    PermissionUpdateFunctionInput
} from "@/components/PermissionList.vue";
import ImportComponentPermissionDialog from "@/components/dialog/ImportComponentPermissionDialog.vue";
import { NodeReturnType, useClient } from "@/graphql/client";
import {
    ComponentPermissionEntry,
    ComponentPermissionOrderField,
    DefaultComponentPermissionInfoFragment,
    OrderDirection
} from "@/graphql/generated";
import { permissionSortFields } from "@/util/permissionSortFields";
import { computed } from "vue";
import { useRoute } from "vue-router";

const client = useClient();
const route = useRoute();

const componentId = computed(() => route.params.trackable as string);

const permissionEntries = Object.values(ComponentPermissionEntry);

const itemManager: ItemManager<DefaultComponentPermissionInfoFragment, keyof typeof permissionSortFields> = {
    fetchItems: async function (
        filter: string | undefined,
        sortField: keyof typeof permissionSortFields,
        sortAscending: boolean,
        count: number,
        page: number
    ): Promise<[DefaultComponentPermissionInfoFragment[], number]> {
        if (filter == undefined) {
            const res = await client.getComponentPermissionList({
                orderBy: {
                    field: permissionSortFields[sortField] as ComponentPermissionOrderField,
                    direction: sortAscending ? OrderDirection.Asc : OrderDirection.Desc
                },
                count,
                skip: page * count,
                component: componentId.value
            });
            const labels = (res.node as NodeReturnType<"getComponentPermissionList", "Component">).permissions;
            return [labels.nodes, labels.totalCount];
        } else {
            const res = await client.getFilteredComponentPermissionList({
                query: filter,
                count,
                component: componentId.value
            });
            return [res.searchComponentPermissions, res.searchComponentPermissions.length];
        }
    }
};

async function removePermission(id: string): Promise<void> {
    await client.removeComponentPermissionFromComponent({ component: componentId.value, componentPermission: id });
}

async function updatePermission(input: PermissionUpdateFunctionInput<ComponentPermissionEntry>): Promise<void> {
    await client.updateComponentPermission({ input });
}
</script>