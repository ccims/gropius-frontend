<template>
    <PaginatedList
        name="issue boards"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(board: IssueBoard) => boardRoute(board)"
        :dependencies="modifiedBoards"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #prepend>
                    <v-icon class="mr-4" icon="mdi-view-column-outline" />
                </template>
                <template #append>
                    <div class="text-medium-emphasis d-flex align-center mr-6">
                        <v-icon icon="mdi-view-week-outline" class="mr-1" />
                        {{ item.issueBoardColumns.totalCount }}
                        <v-tooltip activator="parent" location="bottom">Columns</v-tooltip>
                    </div>
                    <div class="text-medium-emphasis d-flex align-center mr-6">
                        <v-icon icon="$issue" class="mr-1" />
                        {{ item.issueBoardItems.totalCount }}
                        <v-tooltip activator="parent" location="bottom">Issues</v-tooltip>
                    </div>
                </template>
            </ListItem>
        </template>
        <CreateIssueBoardDialog :trackable="trackableId" @created-issue-board="modifiedBoards.push($event.id)" />
    </PaginatedList>
</template>
<script lang="ts" setup>
import ListItem from "@/components/ListItem.vue";
import PaginatedList from "@/components/PaginatedList.vue";
import CreateIssueBoardDialog from "@/components/dialog/CreateIssueBoardDialog.vue";
import { queryNode, request } from "@/gql/client";
import { graphql } from "@/gql";
import type { DefaultIssueBoardInfoFragment, IssueBoardOrder, IssueBoardOrderField } from "@/gql/graphql";
import { ItemManager } from "@/util/itemManager";
import { computed, ref } from "vue";
import { type RouteLocationRaw, useRoute } from "vue-router";
import type { IdObject } from "@/util/types";

const getIssueBoardListQuery = graphql(`
    query getIssueBoardList($orderBy: [IssueBoardOrder!]!, $count: Int!, $skip: Int!, $trackable: ID!) {
        node(id: $trackable) {
            __typename
            ... on Trackable {
                issueBoards(orderBy: $orderBy, first: $count, skip: $skip) {
                    nodes {
                        ...DefaultIssueBoardInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredIssueBoardListQuery = graphql(`
    query getFilteredIssueBoardList($query: String!, $count: Int!, $trackable: ID!) {
        searchIssueBoards(query: $query, first: $count, filter: { trackable: { id: { eq: $trackable } } }) {
            ...DefaultIssueBoardInfo
        }
    }
`);

type IssueBoard = DefaultIssueBoardInfoFragment;

const route = useRoute();
const trackableId = computed(() => route.params.trackable as string);
const modifiedBoards = ref<string[]>([]);

const sortFields: Record<string, IssueBoardOrderField> = {
    Name: "NAME"
};

class IssueBoardItemManager extends ItemManager<IssueBoard, IssueBoardOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: IssueBoardOrder[],
        count: number,
        page: number
    ): Promise<[IssueBoard[], number]> {
        if (filter == undefined) {
            const res = await queryNode(getIssueBoardListQuery, "Component", {
                orderBy,
                count,
                skip: page * count,
                trackable: trackableId.value
            });
            if (res) {
                return [res.issueBoards.nodes, res.issueBoards.totalCount];
            }
        } else {
            const res = await request(getFilteredIssueBoardListQuery, {
                query: filter,
                count,
                trackable: trackableId.value
            });
            if (res) {
                return [res.searchIssueBoards, res.searchIssueBoards.length];
            }
        }
        return [[], 0];
    }
}
const itemManager: ItemManager<IssueBoard, IssueBoardOrderField> = new IssueBoardItemManager();

function boardRoute(board: IdObject): RouteLocationRaw {
    return {
        name: `${routePrefix.value}-issue-board`,
        params: { trackable: trackableId.value, board: board.id }
    };
}

const routePrefix = computed(() => (route.name?.toString().startsWith("component") ? "component" : "project"));
</script>
