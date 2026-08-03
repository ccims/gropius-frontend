<template>
    <PaginatedList
        name="components"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(component: Component) => componentRoute(component)"
        query-param-prefix=""
        :dependencies="dependencyArray"
    >
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #append>
                    <div class="text-medium-emphasis issue-container">
                        <v-icon icon="mdi-alert-circle-outline" />
                        {{ item.openIssues.totalCount }}
                    </div>
                </template>
            </ListItem>
        </template>
        <template #additional-filter>
            <FilterDropdown
                v-model="templateIds"
                :item-manager="itemManager"
                :mapper="(item) => item.template"
                label="Template"
                :fetch-on-search="templateFetch"
            />
        </template>
        <CreateComponentDialog @created-component="(component: IdObject) => selectComponent(component)" />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import {
    type ComponentFilterInput,
    type ComponentOrder,
    ComponentOrderField,
    type ComponentListItemInfoFragment
} from "@/gql/graphql";
import { type RouteLocationRaw, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import CreateComponentDialog from "@/components/dialog/CreateComponentDialog.vue";
import type { IdObject } from "@/util/types";
import { ItemManager } from "@/util/itemManager";
import FilterDropdown from "@/components/input/FilterDropdown.vue";
import { useFilterOption } from "@/util/useFilterOption";
import { computed } from "vue";

const getComponentListQuery = graphql(`
    query getComponentList($orderBy: [ComponentOrder!]!, $count: Int!, $skip: Int!, $filter: ComponentFilterInput!) {
        components(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
            nodes {
                ...ComponentListItemInfo
            }
            totalCount
        }
    }
`);

const getFilteredComponentListQuery = graphql(`
    query getFilteredComponentList($query: String!, $count: Int!, $filter: ComponentFilterInput!) {
        searchComponents(query: $query, first: $count, filter: $filter) {
            ...ComponentListItemInfo
        }
    }
`);

const searchComponentTemplatesQuery = graphql(`
    query searchComponentTemplates($query: String!, $count: Int!) {
        searchComponentTemplates(query: $query, first: $count) {
            id
            name
        }
    }
`);

type Component = ComponentListItemInfoFragment;

const router = useRouter();

const sortFields = {
    Name: ComponentOrderField.Name,
    Template: [ComponentOrderField.TemplateName, ComponentOrderField.TemplateId],
    "[Default]": ComponentOrderField.Id
};

const templateIds = useFilterOption("template", true);
const templateInput = computed(() => {
    if (templateIds.value.length == 0) {
        return undefined;
    }
    return { id: { in: templateIds.value } };
});
const templateFetch = async (query: string) => {
    const res = await requestThrow(searchComponentTemplatesQuery, { query: query, count: 100 });
    return res.searchComponentTemplates;
};

const dependencyArray = computed(() => [templateInput]);

class ComponentItemManager extends ItemManager<Component, ComponentOrderField> {
    protected async fetchItems(
        filter: string,
        orderBy: ComponentOrder[],
        count: number,
        page: number
    ): Promise<[Component[], number]> {
        const generalFilters: ComponentFilterInput = {
            template: templateInput.value
        };
        if (filter == undefined) {
            const res = await request(getComponentListQuery, {
                orderBy,
                count,
                skip: page * count,
                filter: generalFilters
            });
            if (res) {
                return [res.components.nodes, res.components.totalCount];
            }
        } else {
            const res = await request(getFilteredComponentListQuery, {
                query: filter,
                count,
                filter: generalFilters
            });
            if (res) {
                return [res.searchComponents, res.searchComponents.length];
            }
        }
        return [[], 0];
    }
}
const itemManager: ItemManager<Component, ComponentOrderField> = new ComponentItemManager();

function selectComponent(component: IdObject) {
    router.push(componentRoute(component));
}

function componentRoute(component: IdObject): RouteLocationRaw {
    return {
        name: "component",
        params: {
            trackable: component.id
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
