<template>
    <div class="h-100 d-flex flex-column pt-3">
        <div class="d-flex align-center mb-3 mx-3">
            <div class="text-h6">Recent issues</div>
            <v-spacer />
            <v-btn-toggle class="segmented-button ml-2" mandatory v-model="issueFilterIndex">
                <v-btn :prepend-icon="issueFilterIndex == 0 ? 'mdi-check' : 'mdi-pencil'"> Participated </v-btn>
                <v-btn :prepend-icon="issueFilterIndex == 1 ? 'mdi-check' : 'mdi-plus'"> Created </v-btn>
                <v-btn :prepend-icon="issueFilterIndex == 2 ? 'mdi-check' : 'mdi-account'"> Assigned </v-btn>
            </v-btn-toggle>
        </div>
        <div class="flex-1-1 overflow-y-hidden">
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
                        :item-manager="itemManager"
                        :state-indices="issueStateIndices"
                        :show-only-assigned-issues="issueFilterIndex == 2"
                        ref="filterDropdowns"
                    />
                </template>
            </PaginatedList>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useClient } from "@/graphql/client";
import { computed } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import PaginatedList from "@/components/PaginatedList.vue";
import {
    IssueFilterInput,
    IssueOrder,
    IssueOrderField,
    ParticipatingIssueListItemInfoFragment
} from "@/graphql/generated";
import IssueListItem from "@/components/IssueListItem.vue";
import IssueStateSegmentedButton from "@/components/input/IssueStateSegmentedButton.vue";
import { useAppStore } from "@/store/app";
import { issueSortFields } from "@/util/issueSortFields";
import { ItemManager } from "@/util/itemManager";
import IssueFilterDropdowns from "@/components/input/IssueFilterDropdowns.vue";
import { useTemplateRef } from "vue";

type Issue = ParticipatingIssueListItemInfoFragment;

const client = useClient();
const router = useRouter();
const route = useRoute();
const store = useAppStore();

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
const categories = ["participated", "created", "assigned"];
const issueFilterIndex = computed({
    get: () => categories.indexOf((route.query.category as string) ?? "participated"),
    set: (value: number) => {
        router.replace({ query: { ...route.query, category: categories[value] } });
    }
});

const userId = computed(() => store.user!.id);
const userFilter = computed(() => ({
    id: {
        eq: userId.value
    }
}));

class IssueItemManager extends ItemManager<Issue, IssueOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: IssueOrder[],
        count: number,
        page: number
    ): Promise<[Issue[], number]> {
        const currentFilter = filterFromDropdown.value;
        const issueFilter: IssueFilterInput = currentFilter
            ? {
                  labels: currentFilter.labelInput,
                  template: currentFilter.templateInput,
                  assignments: currentFilter.assignedToInput
                      ? {
                            any: {
                                and: [currentFilter.assignedToInput.any]
                            }
                        }
                      : undefined,
                  priority: currentFilter.priorityInput,
                  type: currentFilter.typeInput,
                  state: currentFilter.stateInput,
                  affects: currentFilter.affectedInput
              }
            : {};
        if (issueFilterIndex.value == 1) {
            issueFilter.createdBy = userFilter.value;
        } else if (issueFilterIndex.value == 2) {
            if (issueFilter.assignments === undefined) {
                issueFilter.assignments = {
                    any: {
                        user: userFilter.value
                    }
                };
            } else {
                issueFilter.assignments?.any?.and?.push({
                    user: userFilter.value
                });
            }
        }
        if (filter == undefined) {
            const res = await client.getParticipatingIssueList({
                orderBy,
                count,
                skip: page * count,
                filter: issueFilter
            });
            const issues = res.currentUser!.participatedIssues;
            return [issues.nodes, issues.totalCount];
        } else {
            if (issueFilterIndex.value == 0) {
                issueFilter.participants = {
                    any: userFilter.value
                };
            }
            const res = await client.getParticipatingFilteredIssueList({
                query: filter,
                count,
                filter: issueFilter
            });
            return [res.searchIssues, res.searchIssues.length];
        }
    }
}
const itemManager: ItemManager<Issue, IssueOrderField> = new IssueItemManager();

function issueRoute(issue: Issue): RouteLocationRaw {
    const trackable = issue.trackables.nodes[0];
    return {
        name: trackable.__typename == "Component" ? "component-issue" : "project-issue",
        params: { issue: issue.id, trackable: trackable.id }
    };
}
</script>
