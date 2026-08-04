<template>
    <PaginatedList
        name="interface specifications"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(interfaceSpecification: InterfaceSpecification) => interfaceSpecificationRoute(interfaceSpecification)"
        query-param-prefix=""
        :dependencies="dependencyArray"
    >
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            />
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
        <CreateInterfaceSpecificationDialog
            :component="trackableId"
            :component-template="componentTemplateInfo?.template?.id"
            allow-invisible
            @created-interface-specification="
                (interfaceSpecification: IdObject) => selectInterfaceSpecification(interfaceSpecification)
            "
        />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { queryNode, queryNodeThrow, request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import {
    type InterfaceSpecificationFilterInput,
    type InterfaceSpecificationListItemInfoFragment,
    type InterfaceSpecificationOrder,
    type InterfaceSpecificationOrderField
} from "@/gql/graphql";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import CreateInterfaceSpecificationDialog from "@/components/dialog/CreateInterfaceSpecificationDialog.vue";
import type { IdObject } from "@/util/types";
import { computed } from "vue";
import { computedAsync } from "@vueuse/core";
import { withErrorMessage } from "@/util/withErrorMessage";
import { ItemManager } from "@/util/itemManager";
import { useFilterOption } from "@/util/useFilterOption";
import FilterDropdown from "@/components/input/FilterDropdown.vue";

type InterfaceSpecification = InterfaceSpecificationListItemInfoFragment;

const getComponentTemplateDetailsQuery = graphql(`
    query getComponentTemplateDetails($id: ID!) {
        node(id: $id) {
            id
            ... on Component {
                template {
                    id
                }
            }
        }
    }
`);

const getInterfaceSpecificationListQuery = graphql(`
    query getInterfaceSpecificationList(
        $orderBy: [InterfaceSpecificationOrder!]!
        $count: Int!
        $skip: Int!
        $component: ID!
        $filter: InterfaceSpecificationFilterInput!
    ) {
        node(id: $component) {
            ... on Component {
                interfaceSpecifications(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
                    nodes {
                        ...InterfaceSpecificationListItemInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredInterfaceSpecificationListQuery = graphql(`
    query getFilteredInterfaceSpecificationList(
        $query: String!
        $count: Int!
        $filter: InterfaceSpecificationFilterInput!
    ) {
        searchInterfaceSpecifications(query: $query, first: $count, filter: $filter) {
            ...InterfaceSpecificationListItemInfo
        }
    }
`);

const searchInterfaceSpecificationTemplatesQuery = graphql(`
    query searchInterfaceSpecificationTemplatesForComponentInterfaces($query: String!, $count: Int!) {
        searchInterfaceSpecificationTemplates(query: $query, first: $count) {
            id
            name
            description
        }
    }
`);

const router = useRouter();
const route = useRoute();
const trackableId = computed(() => route.params.trackable as string);

const componentTemplateInfo = computedAsync(
    async () => {
        return await withErrorMessage(async () => {
            return queryNodeThrow(getComponentTemplateDetailsQuery, "Component", { id: trackableId.value });
        }, "Error loading component template info");
    },
    null,
    { shallow: false }
);

const sortFields: Record<string, InterfaceSpecificationOrderField | InterfaceSpecificationOrderField[]> = {
    Name: "NAME",
    Template: ["TEMPLATE_NAME", "TEMPLATE_ID"],
    "[Default]": "ID"
};

const templateIds = useFilterOption("template", true);
const templateInput = computed<InterfaceSpecificationFilterInput | undefined>(() => {
    if (templateIds.value.length === 0) {
        return undefined;
    }
    return {
        id: { in: templateIds.value }
    };
});
const dependencyArray = computed(() => [templateInput]);
const templateFetch = async (search: string) => {
    const res = await requestThrow(searchInterfaceSpecificationTemplatesQuery, {
        query: search,
        count: 100
    });
    return res.searchInterfaceSpecificationTemplates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description
    }));
};

class InterfaceItemManager extends ItemManager<InterfaceSpecification, InterfaceSpecificationOrderField> {
    protected async fetchItems(
        filter: string,
        orderBy: InterfaceSpecificationOrder[],
        count: number,
        page: number
    ): Promise<[InterfaceSpecification[], number]> {
        if (filter == undefined) {
            const component = await queryNode(getInterfaceSpecificationListQuery, "Component", {
                orderBy,
                count,
                skip: page * count,
                filter: { template: templateInput.value },
                component: trackableId.value
            });
            if (component) {
                return [component.interfaceSpecifications.nodes, component.interfaceSpecifications.totalCount];
            }
        } else {
            const res = await request(getFilteredInterfaceSpecificationListQuery, {
                query: filter,
                count,
                filter: {
                    component: { id: { eq: trackableId.value } },
                    template: templateInput.value
                }
            });
            if (res) {
                return [res.searchInterfaceSpecifications, res.searchInterfaceSpecifications.length];
            }
        }
        return [[], 0];
    }
}

const itemManager: ItemManager<InterfaceSpecification, InterfaceSpecificationOrderField> = new InterfaceItemManager();

function selectInterfaceSpecification(interfaceSpecification: IdObject) {
    router.push(interfaceSpecificationRoute(interfaceSpecification));
}

function interfaceSpecificationRoute(interfaceSpecification: IdObject): RouteLocationRaw {
    return {
        name: "interface-specification-versions",
        params: {
            interfaceSpecification: interfaceSpecification.id
        }
    };
}
</script>
