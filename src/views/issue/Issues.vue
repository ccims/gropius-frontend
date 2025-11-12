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
import { NodeReturnType, useClient } from "@/graphql/client";
import { computed, useTemplateRef } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import PaginatedList from "@/components/PaginatedList.vue";
import { IssueFilterInput, IssueListItemInfoFragment, IssueOrder, IssueOrderField } from "@/graphql/generated";
import IssueListItem from "@/components/IssueListItem.vue";
import IssueStateSegmentedButton from "@/components/input/IssueStateSegmentedButton.vue";
import { IdObject } from "@/util/types";
import IssueDialogs from "@/components/IssueDialogs.vue";
import { issueSortFields } from "@/util/issueSortFields";
import { ItemManager } from "@/util/itemManager";
import IssueFilterDropdowns from "@/components/input/IssueFilterDropdowns.vue";

type Trackable = NodeReturnType<"getIssueList", "Component">;
type Issue = IssueListItemInfoFragment;

const client = useClient();
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
            const res = await client.getIssueList({
                orderBy,
                count,
                skip: page * count,
                trackable: trackableId.value,
                filter: generalFilters
            });
            const issues = (res.node as Trackable).issues;
            return [issues.nodes, issues.totalCount];
        } else {
            const res = await client.getFilteredIssueList({
                query: filter,
                count,
                filter: {
                    ...generalFilters,
                    trackables: { any: { id: { eq: trackableId.value } } }
                }
            });
            return [res.searchIssues, res.searchIssues.length];
        }
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
