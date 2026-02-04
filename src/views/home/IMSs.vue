<template>
    <PaginatedList
        name="IMSs"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(ims: IMS) => imsRoute(ims)"
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
                    <SyncSelfAllowedSwitch :target="item as any" />
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
        <CreateIMSDialog @created-ims="(ims: IdObject) => selectIMS(ims)" />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { RouteLocationRaw, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import CreateIMSDialog from "@/components/dialog/CreateIMSDialog.vue";
import { IdObject } from "@/util/types";
import { ImsFilterInput, ImsOrder, ImsListItemInfoFragment } from "@/gql/graphql";
import { ImsOrderField } from "@/gql/graphql";
import SyncSelfAllowedSwitch from "@/components/input/SyncSelfAllowedSwitch.vue";
import { ItemManager } from "@/util/itemManager";
import { useFilterOption } from "@/util/useFilterOption";
import FilterDropdown from "@/components/input/FilterDropdown.vue";
import { computed } from "vue";

const getIMSListQuery = graphql(`
    query getIMSList($orderBy: [IMSOrder!]!, $count: Int!, $skip: Int!, $filter: IMSFilterInput!) {
        imss(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
            nodes {
                ...IMSListItemInfo
            }
            totalCount
        }
    }
`);

const getFilteredIMSListQuery = graphql(`
    query getFilteredIMSList($query: String!, $count: Int!, $filter: IMSFilterInput) {
        searchIMSs(query: $query, first: $count, filter: $filter) {
            ...IMSListItemInfo
        }
    }
`);

const searchIMSTemplatesQuery = graphql(`
    query searchIMSTemplates($query: String!, $count: Int!) {
        searchIMSTemplates(query: $query, first: $count) {
            id
            name
        }
    }
`);

type IMS = ImsListItemInfoFragment;

const router = useRouter();

const sortFields = {
    Name: ImsOrderField.Name,
    Template: [ImsOrderField.TemplateName, ImsOrderField.TemplateId],
    "[Default]": ImsOrderField.Id
};

const templateIds = useFilterOption("template", true);
const templateInput = computed(() => {
    if (templateIds.value.length === 0) {
        return undefined;
    }
    return { id: { in: templateIds.value } };
});
const templateFetch = async (query: string) => {
    const res = await requestThrow(searchIMSTemplatesQuery, { query: query, count: 100 });
    return res.searchIMSTemplates;
};

const dependencyArray = computed(() => [templateInput]);

class IMSItemManager extends ItemManager<IMS, ImsOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: ImsOrder[],
        count: number,
        page: number
    ): Promise<[IMS[], number]> {
        const generalFilter: ImsFilterInput = {
            template: templateInput.value
        };
        if (filter == undefined) {
            const res = await request(getIMSListQuery, {
                orderBy,
                count,
                skip: page * count,
                filter: generalFilter
            });
            if (res) {
                return [res.imss.nodes, res.imss.totalCount];
            }
        } else {
            const res = await request(getFilteredIMSListQuery, {
                query: filter,
                count,
                filter: generalFilter
            });
            if (res) {
                return [res.searchIMSs, res.searchIMSs.length];
            }
        }
        return [[], 0];
    }
}

const itemManager: ItemManager<IMS, ImsOrderField> = new IMSItemManager();

function selectIMS(ims: IdObject) {
    router.push(imsRoute(ims));
}

function imsRoute(ims: IdObject): RouteLocationRaw {
    return {
        name: "ims",
        params: {
            ims: ims.id
        }
    };
}
</script>
