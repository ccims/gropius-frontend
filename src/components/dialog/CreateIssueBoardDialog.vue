<template>
    <v-dialog v-model="createIssueBoardDialog" persistent width="auto">
        <IssueBoardDialogContent
            title="Create issue board"
            discard-title="Discard issue board?"
            discard-message="Are you sure you want to discard this issue board?"
            submit-action="Create issue board"
            :initial-value="initialValue"
            :submit-disabled="submitDisabled"
            @submit="createIssueBoard"
            @cancel="createIssueBoardDialog = false"
        />
    </v-dialog>
</template>
<script lang="ts" setup>
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { onEvent } from "@/util/eventBus";
import { ref } from "vue";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import IssueBoardDialogContent, { type IssueBoard } from "./IssueBoardDialogContent.vue";
import type { DefaultIssueBoardInfoFragment } from "@/gql/graphql";

const createIssueBoardMutation = graphql(`
    mutation createIssueBoard($input: CreateIssueBoardInput!) {
        createIssueBoard(input: $input) {
            issueBoard {
                ...DefaultIssueBoardInfo
            }
        }
    }
`);

const createIssueBoardDialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "created-issue-board", issueBoard: DefaultIssueBoardInfoFragment): void;
}>();

const props = defineProps({
    trackable: {
        type: String,
        required: true
    }
});

const initialValue = ref({
    name: "",
    description: ""
});

onEvent("create-issue-board", () => {
    createIssueBoardDialog.value = true;
});

async function createIssueBoard(state: IssueBoard) {
    const issueBoard = await blockWithErrorMessage(async () => {
        const res = await requestThrow(createIssueBoardMutation, {
            input: {
                ...state,
                trackable: props.trackable
            }
        });
        return res.createIssueBoard.issueBoard;
    }, "Error creating issue board");
    createIssueBoardDialog.value = false;
    emit("created-issue-board", issueBoard);
}
</script>
