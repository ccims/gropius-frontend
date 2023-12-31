<template>
    <PaginatedList
        :item-manager="itemManager"
        :sort-fields="Object.keys(sortFields)"
        :to="(componentVersion: ComponentVersion) => componentVersionRoute(componentVersion)"
    >
        <template #item="{ item }">
            <ListItem :title="item.name" :subtitle="item.description">
                <template #append>
                    <div class="text-medium-emphasis mr-2">v{{ item.version }}</div>
                    <div class="text-medium-emphasis issue-container">
                        <v-icon icon="mdi-source-commit-start" />
                        {{ item.interfaceDefinitions.totalCount }}
                    </div>
                </template>
            </ListItem>
        </template>
        <CreateComponentVersionDialog
            :component="trackableId"
            @created-component-version="(componentVersion) => selectComponentVersion(componentVersion)"
        />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList, { ItemManager } from "@/components/PaginatedList.vue";
import { NodeReturnType, useClient } from "@/graphql/client";
import { ComponentVersionOrderField, OrderDirection } from "@/graphql/generated";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import CreateComponentDialog from "@/components/dialog/CreateComponentDialog.vue";
import { computed, inject } from "vue";
import CreateComponentVersionDialog from "@/components/dialog/CreateComponentVersionDialog.vue";

type ComponentVersion = NodeReturnType<"getComponentVersionList", "Component">["versions"]["nodes"][0];

const client = useClient();
const router = useRouter();
const route = useRoute();
const trackableId = computed(() => route.params.trackable as string);

const sortFields = {
    "[Default]": ComponentVersionOrderField.Id,
    Name: ComponentVersionOrderField.Name
};

const itemManager: ItemManager<ComponentVersion, keyof typeof sortFields> = {
    filterLocal: function (item: ComponentVersion, filter: string): boolean {
        return item.name.includes(filter);
    },
    fetchItems: async function (
        filter: string,
        sortField: keyof typeof sortFields,
        sortAscending: boolean,
        count: number,
        page: number
    ): Promise<[ComponentVersion[], number]> {
        const res = (
            await client.getComponentVersionList({
                filter,
                orderBy: {
                    field: sortFields[sortField],
                    direction: sortAscending ? OrderDirection.Asc : OrderDirection.Desc
                },
                count,
                skip: page * count,
                component: trackableId.value
            })
        ).node as NodeReturnType<"getComponentVersionList", "Component">;
        return [res.versions.nodes!, res.versions.totalCount];
    }
};

function selectComponentVersion(componentVersion: { id: string }) {
    router.push(componentVersionRoute(componentVersion));
}

function componentVersionRoute(componentVersion: { id: string }): RouteLocationRaw {
    return {
        name: "component-version",
        params: {
            version: componentVersion.id
        }
    };
}
</script>
<style scoped lang="scss">
@use "@/styles/settings";
.issue-container {
    min-width: settings.$icon-with-number-width;
}
</style>
