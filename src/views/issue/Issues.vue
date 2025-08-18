<template>
    <PaginatedList
        name="issues"
        :item-manager="itemManager"
        :sort-fields="issueSortFields"
        :to="(issue: Issue) => issueRoute(issue)"
        :sort-ascending-initially="false"
        :dependencies="[stateFilterInput, templateInput, labelInput, assignedToInput, priorityInput, typeInput]"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <IssueListItem :item="item" />
        </template>
        <template #search-append>
            <IssueStateSegmentedButton v-model="issueStateIndices" class="ml-2" />
        </template>
        <template #additional-filter>
            <div class="d-flex ga-4 align-center h-100">
                <FilterDropdown
                    v-model="templateIds"
                    label="Template"
                    :item-manager="itemManager"
                    :mapper="(item) => item.template"
                    :fetch-on-search="
                        async (search: string) =>
                            client
                                .getUsedIssueTemplates({ trackable: trackableId, filter: search })
                                .then(
                                    (res) =>
                                        (res.node as NodeReturnType<'getUsedIssueTemplates', 'Component'>)
                                            .usedIssueTemplates.nodes
                                )
                    "
                />
                <FilterDropdown
                    v-model="labelIds"
                    label="Label"
                    :item-manager="itemManager"
                    :mapper="(item) => item.labels.nodes"
                    :additional-initial-values="
                        async () =>
                            client
                                .firstTrackableLabels({ trackable: trackableId, count: 100 })
                                .then(
                                    (res) =>
                                        (res.node as NodeReturnType<'firstTrackableLabels', 'Component'>).labels.nodes
                                )
                    "
                    :fetch-on-search="
                        async (search: string) =>
                            client
                                .getUsedLabels({ trackable: trackableId, filter: search })
                                .then(
                                    (res) => (res.node as NodeReturnType<'getUsedLabels', 'Component'>).usedLabels.nodes
                                )
                    "
                >
                    <template #default="{ item }">
                        <div class="d-flex align-center">
                            <v-icon :color="(item as any)['color']" class="opacity-100 mr-1" icon="mdi-circle" />
                            {{ item.name }}
                        </div>
                    </template>
                </FilterDropdown>
                <FilterDropdown
                    v-model="priorityIds"
                    label="Priority"
                    :item-manager="itemManager"
                    :mapper="(item) => item.priority"
                    :sorter="(a, b) => a.value - b.value"
                    :fetch-on-search="
                        async (search: string) =>
                            client
                                .getUsedIssuePriorities({ trackable: trackableId, filter: search })
                                .then(
                                    (res) =>
                                        (res.node as NodeReturnType<'getUsedIssuePriorities', 'Component'>)
                                            .usedIssuePriorities.nodes
                                )
                    "
                />
                <FilterDropdown
                    v-model="typeIds"
                    label="Type"
                    :item-manager="itemManager"
                    :mapper="(item) => item.type"
                    :fetch-on-search="
                        async (search: string) =>
                            client
                                .getUsedIssueTypes({ trackable: trackableId, filter: search })
                                .then(
                                    (res) =>
                                        (res.node as NodeReturnType<'getUsedIssueTypes', 'Component'>).usedIssueTypes
                                            .nodes
                                )
                    "
                >
                    <template #default="{ item }">
                        <div class="d-flex align-center">
                            <IssueTypeIcon
                                :path="item.iconPath"
                                fill="rgb(var(--v-theme-primary))"
                                class="type-icon mr-1"
                            />
                            {{ item.name }}
                        </div>
                    </template>
                </FilterDropdown>
                <FilterDropdown
                    v-model="assignedToIds"
                    label="Assigned to"
                    :item-manager="itemManager"
                    :mapper="
                        (item) =>
                            item.assignments.nodes.map((node) => {
                                const name = node.user.id == store.user?.id ? 'Me' : node.user.displayName;
                                return {
                                    ...node.user,
                                    displayName: name,
                                    name
                                };
                            })
                    "
                    :sorter="assignedToSorter"
                    :fetch-on-search="
                        async (search: string) =>
                            client.getAssignedUsers({ trackable: trackableId, filter: search }).then((res) =>
                                (res.node as NodeReturnType<'getAssignedUsers', 'Component'>).assignedUsers.nodes.map(
                                    (node) => {
                                        const name = node.id == store.user?.id ? 'Me' : node.displayName;
                                        return {
                                            ...node,
                                            displayName: name,
                                            name
                                        };
                                    }
                                )
                            )
                    "
                >
                    <template #default="{ item }">
                        <User :user="item" />
                    </template>
                </FilterDropdown>
                <FilterDropdown
                    label="State"
                    :mapper="(item) => item.state"
                    :item-manager="itemManager"
                    :fetch-on-search="
                        async (search: string) =>
                            client
                                .getUsedIssueStates({ trackable: trackableId, filter: search })
                                .then(
                                    (res) =>
                                        (res.node as NodeReturnType<'getUsedIssueStates', 'Component'>).usedIssueStates
                                            .nodes
                                )
                    "
                >
                    <template #default="{ item }">
                        <span class="d-flex align-center">
                            <v-icon
                                :color="item.isOpen ? 'issue-open' : 'issue-closed'"
                                class="opacity-100 mr-1"
                                icon="mdi-circle"
                            />
                            {{ item.name }}
                        </span>
                    </template>
                </FilterDropdown>
            </div>
        </template>
        <IssueDialogs />
    </PaginatedList>
</template>
<script lang="ts" setup>
import { NodeReturnType, useClient } from "@/graphql/client";
import { computed, ref } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import PaginatedList from "@/components/PaginatedList.vue";
import { IssueFilterInput, IssueListItemInfoFragment, IssueOrder, IssueOrderField } from "@/graphql/generated";
import IssueListItem from "@/components/IssueListItem.vue";
import IssueStateSegmentedButton from "@/components/input/IssueStateSegmentedButton.vue";
import { IdObject } from "@/util/types";
import IssueDialogs from "@/components/IssueDialogs.vue";
import { issueSortFields } from "@/util/issueSortFields";
import { ItemManager } from "@/util/itemManager";
import FilterDropdown from "@/components/input/FilterDropdown.vue";
import { useFilterOption } from "@/util/useFilterOption";
import { useAppStore } from "@/store/app";
import User from "@/components/info/User.vue";
import IssueTypeIcon from "@/components/IssueTypeIcon.vue";

type Trackable = NodeReturnType<"getIssueList", "Component">;
type TrackableLabel = NodeReturnType<"getLabelList", "Component">;
type Issue = IssueListItemInfoFragment;

const client = useClient();
const router = useRouter();
const route = useRoute();
const store = useAppStore();

const templateIds = useFilterOption("template");
const templateInput = computed(() => {
    return templateIds.value.length > 0 ? { id: { in: templateIds.value } } : undefined;
});
const labelIds = useFilterOption("label");
const labelInput = computed(() => {
    return labelIds.value.length > 0 ? { any: { id: { in: labelIds.value } } } : undefined;
});
const priorityIds = useFilterOption("priority");
const priorityInput = computed(() => {
    return priorityIds.value.length > 0 ? { id: { in: priorityIds.value } } : undefined;
});
const typeIds = useFilterOption("type");
const typeInput = computed(() => {
    return typeIds.value.length > 0 ? { id: { in: typeIds.value } } : undefined;
});
const assignedToIds = useFilterOption("assignedTo");
const assignedToInput = computed(() => {
    return assignedToIds.value.length > 0
        ? {
              any: {
                  user: {
                      id: {
                          in: assignedToIds.value
                      }
                  }
              }
          }
        : undefined;
});
const assignedToSorter = (a: IdObject & { name: string }, b: IdObject & { name: string }) => {
    const isAssignedToMeA = store.user?.id == a.id;
    const isAssignedToMeB = store.user?.id == b.id;
    if (isAssignedToMeA && !isAssignedToMeB) return -1;
    if (!isAssignedToMeA && isAssignedToMeB) return 1;
    return a.name.localeCompare(b.name);
};

const stateIds = useFilterOption("concretestate");

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

const stateFilterInput = computed(() => {
    const isSingleIssueState = issueStateIndices.value.length == 1;
    const customStateSelected = !!stateIds.value.length;
    if (!isSingleIssueState && !customStateSelected) {
        return undefined;
    }
    const state = issueStateIndices.value[0] == 0;
    return {
        isOpen: isSingleIssueState ? { eq: state } : undefined,
        id: customStateSelected ? { in: stateIds.value } : undefined
    };
});

const trackableId = computed(() => route.params.trackable as string);

class IssueItemManager extends ItemManager<Issue, IssueOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: IssueOrder[],
        count: number,
        page: number
    ): Promise<[Issue[], number]> {
        const generalFilters: Partial<IssueFilterInput> = {
            labels: labelInput.value,
            template: templateInput.value,
            state: stateFilterInput.value,
            assignments: assignedToInput.value,
            priority: priorityInput.value,
            type: typeInput.value
        };
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

<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.type-icon {
    width: map.get(settings.$avatar-sizes, "large");
    height: map.get(settings.$avatar-sizes, "large");
}
</style>
