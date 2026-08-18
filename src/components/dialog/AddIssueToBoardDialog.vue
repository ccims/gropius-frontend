<template>
    <v-dialog v-model="addIssueDialog" persistent width="auto">
        <v-card color="surface-elevated-3" rounded="lger" class="pa-3 add-issue-content" elevation="0">
            <v-card-title class="pl-4">Add issue to board</v-card-title>
            <div class="pa-4">
                <FetchingAutocomplete
                    v-model="issue"
                    mode="model"
                    :fetch="searchIssues"
                    :dependency="ignore"
                    label="Issue"
                    :item-title="(item: any) => item.title"
                >
                    <template #item="{ props: itemProps, item }">
                        <v-list-item :title="item.raw.title" v-bind="itemProps">
                            <template #prepend>
                                <IssueIcon :issue="item.raw" class="issue-icon mr-2" />
                            </template>
                        </v-list-item>
                    </template>
                </FetchingAutocomplete>
            </div>
            <v-card-actions>
                <v-spacer />
                <DefaultButton variant="text" color="" @click="addIssueDialog = false">Cancel</DefaultButton>
                <DefaultButton variant="text" color="primary" :disabled="submitDisabled || !issue" @click="addIssue">
                    Add issue
                </DefaultButton>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { onEvent } from "@/util/eventBus";
import { ref, type PropType } from "vue";
import { useBlockingWithErrorMessage, withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "../input/FetchingAutocomplete.vue";
import IssueIcon from "../IssueIcon.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import type { IssueBoardCardInfoFragment } from "@/gql/graphql";

const searchIssuesQuery = graphql(`
    query searchIssuesForBoard($query: String!, $count: Int!, $trackable: ID!) {
        searchIssues(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {
            ...IssueBoardCardInfo
        }
    }
`);

const firstIssuesQuery = graphql(`
    query firstIssuesForBoard($trackable: ID!, $count: Int!) {
        node(id: $trackable) {
            __typename
            ... on Trackable {
                issues(first: $count, orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }]) {
                    nodes {
                        ...IssueBoardCardInfo
                    }
                }
            }
        }
    }
`);

const createIssueBoardItemMutation = graphql(`
    mutation createIssueBoardItem($input: CreateIssueBoardItemInput!) {
        createIssueBoardItem(input: $input) {
            issueBoardItem {
                id
            }
        }
    }
`);

const props = defineProps({
    trackable: {
        type: String,
        required: true
    },
    issueBoard: {
        type: String,
        required: true
    },
    nextPosition: {
        type: Number,
        required: true
    },
    ignore: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    }
});

const emit = defineEmits<{
    (event: "added-issue"): void;
}>();

const addIssueDialog = ref(false);
const issue = ref<string | undefined>(undefined);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

onEvent("add-issue-to-board", () => {
    issue.value = undefined;
    addIssueDialog.value = true;
});

async function searchIssues(filter: string, count: number): Promise<IssueBoardCardInfoFragment[]> {
    const issues = await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchIssuesQuery, { query, count, trackable: props.trackable });
            return res.searchIssues;
        }
        const trackable = await queryNodeThrow(firstIssuesQuery, "Component", {
            trackable: props.trackable,
            count
        });
        return trackable.issues.nodes;
    }, "Error searching issues");
    const ignored = new Set(props.ignore);
    return issues.filter((item) => !ignored.has(item.id));
}

async function addIssue() {
    await blockWithErrorMessage(async () => {
        await requestThrow(createIssueBoardItemMutation, {
            input: {
                issueBoard: props.issueBoard,
                issue: issue.value!,
                position: props.nextPosition
            }
        });
    }, "Error adding issue to board");
    addIssueDialog.value = false;
    emit("added-issue");
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.add-issue-content {
    width: min(700px, calc(100vw - 3 * settings.$side-bar-width));
}

.issue-icon {
    width: map.get(settings.$avatar-sizes, "large");
    height: map.get(settings.$avatar-sizes, "large");
}
</style>
