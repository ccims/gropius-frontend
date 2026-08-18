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
                    <IconButton :disabled="!canManage" @click.prevent="boardToUpdate = { ...item }" class="mr-2">
                        <v-icon icon="mdi-pencil" />
                        <v-tooltip activator="parent" location="bottom">Edit issue board</v-tooltip>
                    </IconButton>
                    <IconButton :disabled="!canManage" @click.prevent>
                        <v-icon icon="mdi-delete" />
                        <ConfirmationDialog
                            :title="`Delete issue board ${item.name}?`"
                            message="Are you sure you want to delete this issue board? The issues on it are not deleted."
                            confirm-text="Delete"
                            @confirm="deleteBoard(item.id)"
                        />
                        <v-tooltip activator="parent" location="bottom">Delete issue board</v-tooltip>
                    </IconButton>
                </template>
            </ListItem>
        </template>
        <CreateIssueBoardDialog :trackable="trackableId" @created-issue-board="modifiedBoards.push($event.id)" />
        <UpdateIssueBoardDialog v-model="boardToUpdate" @updated-issue-board="modifiedBoards.push($event.id)" />
    </PaginatedList>
</template>
<script lang="ts" setup>
import ListItem from "@/components/ListItem.vue";
import PaginatedList from "@/components/PaginatedList.vue";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import CreateIssueBoardDialog from "@/components/dialog/CreateIssueBoardDialog.vue";
import UpdateIssueBoardDialog from "@/components/dialog/UpdateIssueBoardDialog.vue";
import { queryNode, request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import type { DefaultIssueBoardInfoFragment, IssueBoardOrder, IssueBoardOrderField } from "@/gql/graphql";
import { ItemManager } from "@/util/itemManager";
import { trackableKey } from "@/util/keys";
import { computed, inject, ref } from "vue";
import { type RouteLocationRaw, useRoute } from "vue-router";
import { withErrorMessage } from "@/util/withErrorMessage";
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

const deleteIssueBoardMutation = graphql(`
    mutation deleteIssueBoard($id: ID!) {
        deleteIssueBoard(input: { id: $id }) {
            id
        }
    }
`);

type IssueBoard = DefaultIssueBoardInfoFragment;

const route = useRoute();
const trackableId = computed(() => route.params.trackable as string);
const trackable = inject(trackableKey);
const canManage = computed(() => trackable?.value?.manageIssueBoards ?? false);
const modifiedBoards = ref<string[]>([]);
const boardToUpdate = ref<(IssueBoard & IdObject) | null>(null);

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

async function deleteBoard(id: string) {
    await withErrorMessage(async () => {
        await requestThrow(deleteIssueBoardMutation, { id });
    }, "Error deleting issue board");
    modifiedBoards.value.push(id);
}
</script>
