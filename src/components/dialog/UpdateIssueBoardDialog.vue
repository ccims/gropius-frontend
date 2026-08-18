<template>
    <v-dialog v-model="updateIssueBoardDialog" persistent width="auto">
        <IssueBoardDialogContent
            v-if="cachedModel != undefined"
            title="Update issue board"
            discard-title="Discard changes?"
            discard-message="Are you sure you want to discard the changes?"
            submit-action="Update issue board"
            :initial-value="cachedModel"
            :submit-disabled="submitDisabled"
            @submit="updateIssueBoard"
            @cancel="updateIssueBoardDialog = false"
        />
    </v-dialog>
</template>
<script lang="ts" setup>
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { computed, type PropType } from "vue";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import IssueBoardDialogContent, { type IssueBoard } from "./IssueBoardDialogContent.vue";
import type { IdObject } from "@/util/types";
import { useCachedRef } from "@/util/useCachedRef";
import type { DefaultIssueBoardInfoFragment } from "@/gql/graphql";

const updateIssueBoardMutation = graphql(`
    mutation updateIssueBoard($input: UpdateIssueBoardInput!) {
        updateIssueBoard(input: $input) {
            issueBoard {
                ...DefaultIssueBoardInfo
            }
        }
    }
`);

const model = defineModel({
    type: Object as PropType<(IssueBoard & IdObject) | null>,
    required: false
});

const updateIssueBoardDialog = computed({
    get: () => model.value != null,
    set: (value) => {
        if (!value) {
            model.value = null;
        }
    }
});
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "updated-issue-board", issueBoard: DefaultIssueBoardInfoFragment): void;
}>();

const cachedModel = useCachedRef(model);

async function updateIssueBoard(state: IssueBoard) {
    const issueBoard = await blockWithErrorMessage(async () => {
        const res = await requestThrow(updateIssueBoardMutation, {
            input: {
                ...state,
                id: model.value!.id
            }
        });
        return res.updateIssueBoard.issueBoard;
    }, "Error updating issue board");
    updateIssueBoardDialog.value = false;
    emit("updated-issue-board", issueBoard);
}
</script>
