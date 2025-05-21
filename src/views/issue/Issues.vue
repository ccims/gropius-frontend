<template>
    <PaginatedList
        name="issues"
        :item-manager="itemManager"
        :sort-fields="issueSortFields"
        :to="(issue: Issue) => issueRoute(issue)"
        :sort-ascending-initially="false"
        :dependencies="[stateFilterInput, issueLabel]"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <IssueListItem :item="item" />
        </template>
        <template #search-append>
            <IssueStateSegmentedButton v-model="issueStateIndices" class="ml-2" />
            <IssueDropdown v-model:selected="issueLabel" :load-options="loadAllLabels" />
        </template>
        <IssueDialogs />
    </PaginatedList>
</template>
<script lang="ts" setup>
import { NodeReturnType, useClient } from "@/graphql/client";
import { computed, ref } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import PaginatedList, { ItemManager } from "@/components/PaginatedList.vue";
import {
    IssueListItemInfoFragment,
    IssueOrder,
    IssueOrderField,
    LabelListFilterInput,
    LabelOrderField,
    OrderDirection
} from "@/graphql/generated";
import IssueListItem from "@/components/IssueListItem.vue";
import IssueStateSegmentedButton from "@/components/input/IssueStateSegmentedButton.vue";
import { IdObject } from "@/util/types";
import IssueDialogs from "@/components/IssueDialogs.vue";
import { issueSortFields } from "@/util/issueSortFields";
import IssueDropdown from "@/components/IssueDropdown.vue";

type Trackable = NodeReturnType<"getIssueList", "Component">;
type TrackableLabel = NodeReturnType<"getLabelList", "Component">;
type Issue = IssueListItemInfoFragment;

const client = useClient();
const router = useRouter();
const route = useRoute();

const loadAllLabels = async () => {
    const res = await client.getLabelList({
        count: 100,
        orderBy: { field: LabelOrderField.Name, direction: OrderDirection.Asc },
        skip: 0,
        trackable: trackableId.value
        // TODO: whats trackable? and what values should be used here for count and skip?
    });
    return (res.node as TrackableLabel).labels.nodes.map((label) => label.name);
};

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
const issueLabel = computed({
    get: () => {
        return route.query.labels as string | undefined;
    },
    set: (value: string | undefined) => {
        router.replace({ query: { ...route.query, labels: value } });
    }
});

const stateFilterInput = computed(() => {
    if (issueStateIndices.value.length != 1) {
        return undefined;
    }
    const state = issueStateIndices.value[0] == 0;
    return { isOpen: { eq: state } };
});
const labelFilterInput = computed(() => {
    if (!issueLabel.value) {
        return undefined;
    }
    return { any: { name: { eq: issueLabel.value } } } as LabelListFilterInput;
});

const trackableId = computed(() => route.params.trackable as string);

const itemManager: ItemManager<Issue, IssueOrderField> = {
    fetchItems: async function (
        filter: string | undefined,
        orderBy: IssueOrder[],
        count: number,
        page: number
    ): Promise<[Issue[], number]> {
        if (filter == undefined) {
            const res = await client.getIssueList({
                orderBy,
                count,
                skip: page * count,
                trackable: trackableId.value,
                filter: { state: stateFilterInput.value, labels: labelFilterInput.value }
            });
            const issues = (res.node as Trackable).issues;
            return [issues.nodes, issues.totalCount];
        } else {
            const res = await client.getFilteredIssueList({
                query: filter,
                count,
                filter: {
                    trackables: { any: { id: { eq: trackableId.value } } },
                    state: stateFilterInput.value,
                    labels: labelFilterInput.value
                }
            });
            return [res.searchIssues, res.searchIssues.length];
        }
    }
};

function issueRoute(issue: IdObject): RouteLocationRaw {
    return {
        name: (route.name as string).slice(0, -1),
        params: { issue: issue.id, trackable: trackableId.value }
    };
}
</script>
