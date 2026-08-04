<template>
    <PaginatedList
        name="issues"
        :item-manager="itemManager"
        :sort-fields="issueSortFields"
        :to="(issue: Issue) => issueRoute(issue)"
        :sort-ascending-initially="false"
        :dependencies="filterFromDropdown?.dependencyArray ?? []"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <IssueListItem :item="item" />
        </template>
        <template #search-append>
            <IssueStateSegmentedButton v-model="issueStateIndices" class="ml-2" />
        </template>
        <template #additional-filter>
            <IssueFilterDropdowns
                :trackable-id="trackableId"
                :item-manager="itemManager"
                :state-indices="issueStateIndices"
                ref="filterDropdowns"
            />
        </template>
        <IssueDialogs />
    </PaginatedList>
</template>
<script lang="ts" setup>
import { computed, useTemplateRef } from "vue";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";
import PaginatedList from "@/components/PaginatedList.vue";
import IssueListItem from "@/components/IssueListItem.vue";
import IssueStateSegmentedButton from "@/components/input/IssueStateSegmentedButton.vue";
import type { IdObject } from "@/util/types";
import IssueDialogs from "@/components/IssueDialogs.vue";
import { issueSortFields } from "@/util/issueSortFields";
import { ItemManager } from "@/util/itemManager";
import IssueFilterDropdowns from "@/components/input/IssueFilterDropdowns.vue";
import { type IssueListItemInfoFragment, IssueOrderField, type IssueOrder, type IssueFilterInput } from "@/gql/graphql";
import { request, queryNode } from "@/gql/client";
import { graphql } from "@/gql";

type Issue = IssueListItemInfoFragment;

const router = useRouter();
const route = useRoute();

const filterFromDropdown = useTemplateRef("filterDropdowns");

const issueStateIndices = computed({
    get: () => {
        const state = (route.query.state as string) ?? "open";
        if (state == "open") {
            return [0];
        } else if (state == "closed") {
            return [1];
        } else {
            return [0, 1];
        }
    },
    set: (value: number[]) => {
        const state = value.length == 1 ? ["open", "closed"][value[0]] : "all";
        router.replace({ query: { ...route.query, state } });
    }
});

const trackableId = computed(() => route.params.trackable as string);

const getIssueList = graphql(`
    query getIssueList(
        $orderBy: [IssueOrder!]!
        $count: Int!
        $skip: Int!
        $filter: IssueFilterInput
        $trackable: ID!
    ) {
        node(id: $trackable) {
            __typename
            ... on Trackable {
                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {
                    nodes {
                        ...IssueListItemInfo
                    }
                    totalCount
                }
            }
        }
    }
`);
const getFilteredIssueList = graphql(`
    query getFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {
        searchIssues(query: $query, first: $count, filter: $filter) {
            ...IssueListItemInfo
        }
    }
`);

class IssueItemManager extends ItemManager<Issue, IssueOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: IssueOrder[],
        count: number,
        page: number
    ): Promise<[Issue[], number]> {
        const currentFilter = filterFromDropdown.value;
        const generalFilters: Partial<IssueFilterInput> = currentFilter
            ? {
                  labels: currentFilter.labelInput,
                  template: currentFilter.templateInput,
                  assignments: currentFilter.assignedToInput,
                  priority: currentFilter.priorityInput,
                  type: currentFilter.typeInput,
                  state: currentFilter.stateInput,
                  affects: currentFilter.affectedInput
              }
            : {};
        if (filter == undefined) {
            const component = await queryNode(getIssueList, "Component", {
                orderBy,
                count,
                skip: page * count,
                trackable: trackableId.value,
                filter: generalFilters
            });
            if (component) {
                return [component.issues.nodes, component.issues.totalCount];
            }
        } else {
            const res = await request(getFilteredIssueList, {
                query: filter,
                count,
                filter: {
                    ...generalFilters,
                    trackables: { any: { id: { eq: trackableId.value } } }
                }
            });
            if (res) {
                return [res.searchIssues, res.searchIssues.length];
            }
        }
        return [[], 0];
    }
}

const itemManager: ItemManager<Issue, IssueOrderField> = new IssueItemManager();

function issueRoute(issue: IdObject): RouteLocationRaw {
    return {
        name: (route.name as string).slice(0, -1),
        params: { issue: issue.id, trackable: trackableId.value }
    };
}
</script>
