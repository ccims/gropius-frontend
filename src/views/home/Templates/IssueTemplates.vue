<template>
    <PaginatedList
        name="issueTemplates"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(template: IssueTemplate) => templateRoute(template)"
        :dependencies="[showDeprecated]"
        query-param-prefix=""
    >
        <template #search-append>
            <v-btn-toggle class="segmented-button ml-2" mandatory v-model="deprecationIndex">
                <v-btn :prepend-icon="showDeprecated ? 'mdi-file-document-outline' : 'mdi-check'"> Active </v-btn>
                <v-btn :prepend-icon="showDeprecated ? 'mdi-check' : 'mdi-archive'"> Deprecated </v-btn>
            </v-btn-toggle>
        </template>
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #append>
                    <div class="text-medium-emphasis issue-container">
                        <v-icon icon="mdi-file-outline" />
                        {{ item.templateFieldSpecifications.length }} fields
                    </div>
                </template>
            </ListItem>
        </template>

        <CreateIssueTemplateDialog @created-template="(template: IdObject) => selectTemplate(template)" />
    </PaginatedList>
</template>

<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { ItemManager } from "@/util/itemManager";
import { request } from "@/gql/client";
import { graphql } from "@/gql";
import {
    type DefaultIssueTemplateInfoFragment,
    type IssueTemplateOrder,
    type IssueTemplateOrderField
} from "@/gql/graphql";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import ListItem from "@/components/ListItem.vue";
import CreateIssueTemplateDialog from "@/components/dialog/CreateIssueTemplateDialog.vue";
import type { IdObject } from "@/util/types";

const getIssueTemplateListQuery = graphql(`
    query getIssueTemplateList($orderBy: [IssueTemplateOrder!]!, $count: Int!, $skip: Int!, $isDeprecated: Boolean!) {
        issueTemplates(orderBy: $orderBy, first: $count, skip: $skip, filter: { isDeprecated: { eq: $isDeprecated } }) {
            nodes {
                ...DefaultIssueTemplateInfo
            }
            totalCount
        }
    }
`);

const getFilteredIssueTemplateListQuery = graphql(`
    query getFilteredIssueTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {
        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: $isDeprecated } }) {
            ...DefaultIssueTemplateInfo
        }
    }
`);

type IssueTemplate = DefaultIssueTemplateInfoFragment;

const router = useRouter();
const route = useRoute();

const showDeprecated = computed(() => route.query.deprecated == "true");
const deprecationIndex = computed({
    get: () => (showDeprecated.value ? 1 : 0),
    set: (value) => {
        router.replace({ query: { ...route.query, deprecated: value == 1 ? "true" : undefined } });
    }
});

const sortFields: Record<string, IssueTemplateOrderField | IssueTemplateOrderField[]> = {
    Name: "NAME",
    "[Default]": "ID"
};

class IssueTemplateItemManager extends ItemManager<IssueTemplate, IssueTemplateOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: IssueTemplateOrder[],
        count: number,
        page: number
    ): Promise<[IssueTemplate[], number]> {
        if (filter == undefined) {
            const res = await request(getIssueTemplateListQuery, {
                orderBy,
                count,
                skip: page * count,
                isDeprecated: showDeprecated.value
            });
            if (res) {
                return [res.issueTemplates.nodes, res.issueTemplates.totalCount];
            }
        } else {
            const res = await request(getFilteredIssueTemplateListQuery, {
                query: filter,
                count,
                isDeprecated: showDeprecated.value
            });
            if (res) {
                return [res.searchIssueTemplates, res.searchIssueTemplates.length];
            }
        }
        return [[], 0];
    }
}

const itemManager: ItemManager<IssueTemplate, IssueTemplateOrderField> = new IssueTemplateItemManager();

function selectTemplate(template: IdObject) {
    router.push(templateRoute(template));
}

function templateRoute(template: IdObject): RouteLocationRaw {
    return {
        name: "issue-template",
        params: {
            issueTemplate: template.id
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
