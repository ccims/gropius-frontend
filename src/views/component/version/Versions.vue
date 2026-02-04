<template>
    <PaginatedList
        name="versions"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(componentVersion: ComponentVersion) => componentVersionRoute(componentVersion)"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem
                :title="`v${item.version}`"
                :subtitle="item.tags.length == 0 ? 'No tags provided' : undefined"
                italic-subtitle
            >
                <template #subtitle v-if="item.tags.length > 0">
                    <div class="d-flex flex-wrap chip-container mt-1">
                        <v-chip
                            v-for="(tag, index) in item.tags"
                            :key="index"
                            color="primary"
                            size="small"
                            class="flex-shrink-0"
                        >
                            {{ tag }}
                        </v-chip>
                    </div>
                </template>
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
            @created-component-version="(componentVersion: IdObject) => selectComponentVersion(componentVersion)"
        />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { ComponentVersionOrder, ComponentVersionOrderField, ComponentVersionListItemInfoFragment } from "@/gql/graphql";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import { computed } from "vue";
import CreateComponentVersionDialog from "@/components/dialog/CreateComponentVersionDialog.vue";
import { IdObject } from "@/util/types";
import { ItemManager } from "@/util/itemManager";
import { queryNode, request } from "@/gql/client";
import { graphql } from "@/gql";

type ComponentVersion = ComponentVersionListItemInfoFragment;

const getComponentVersionListQuery = graphql(`
    query getComponentVersionList($orderBy: [ComponentVersionOrder!]!, $count: Int!, $skip: Int!, $component: ID!) {
        node(id: $component) {
            ... on Component {
                versions(orderBy: $orderBy, first: $count, skip: $skip) {
                    nodes {
                        ...ComponentVersionListItemInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredComponentVersionListQuery = graphql(`
    query getFilteredComponentVersionList($query: String!, $count: Int!, $component: ID!) {
        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {
            ...ComponentVersionListItemInfo
        }
    }
`);

const router = useRouter();
const route = useRoute();
const trackableId = computed(() => route.params.trackable as string);

const sortFields = {
    Version: ComponentVersionOrderField.Version,
    "[Default]": ComponentVersionOrderField.Id
};

class ComponentVersionItemManager extends ItemManager<ComponentVersion, ComponentVersionOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: ComponentVersionOrder[],
        count: number,
        page: number
    ): Promise<[ComponentVersion[], number]> {
        if (filter == undefined) {
            const component = await queryNode(getComponentVersionListQuery, "Component", {
                orderBy,
                count,
                skip: page * count,
                component: trackableId.value
            });
            if (component) {
                return [component.versions.nodes, component.versions.totalCount];
            }
        } else {
            const res = await request(getFilteredComponentVersionListQuery, {
                query: filter,
                count,
                component: trackableId.value
            });
            if (res) {
                return [res.searchComponentVersions, res.searchComponentVersions.length];
            }
        }
        return [[], 0];
    }
}
const itemManager: ItemManager<ComponentVersion, ComponentVersionOrderField> = new ComponentVersionItemManager();

function selectComponentVersion(componentVersion: IdObject) {
    router.push(componentVersionRoute(componentVersion));
}

function componentVersionRoute(componentVersion: IdObject): RouteLocationRaw {
    return {
        name: "component-version-general",
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

.chip-container {
    row-gap: 0.5rem;
    column-gap: 0.25rem;
}
</style>
