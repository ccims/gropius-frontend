<template>
    <v-dialog v-model="updateColumnDialog" persistent width="auto">
        <IssueBoardColumnDialogContent
            v-if="cachedModel != undefined"
            title="Update column"
            discard-title="Discard changes?"
            discard-message="Are you sure you want to discard the changes?"
            submit-action="Update column"
            :initial-value="cachedModel"
            :submit-disabled="submitDisabled"
            @submit="updateColumn"
            @cancel="updateColumnDialog = false"
        />
    </v-dialog>
</template>
<script lang="ts" setup>
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { computed, type PropType } from "vue";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import IssueBoardColumnDialogContent, {
    type IssueBoardColumn,
    type IssueBoardColumnInitialValue
} from "./IssueBoardColumnDialogContent.vue";
import type { IdObject } from "@/util/types";
import { useCachedRef } from "@/util/useCachedRef";
import { addIssueStatesToColumn, removeIssueStatesFromColumn } from "@/util/issueBoardColumnStates";

const updateColumnMutation = graphql(`
    mutation updateIssueBoardColumn($input: UpdateIssueBoardColumnInput!) {
        updateIssueBoardColumn(input: $input) {
            issueBoardColumn {
                id
            }
        }
    }
`);

const model = defineModel({
    type: Object as PropType<(IssueBoardColumnInitialValue & IdObject) | null>,
    required: false
});

const updateColumnDialog = computed({
    get: () => model.value != null,
    set: (value) => {
        if (!value) {
            model.value = null;
        }
    }
});
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "updated-issue-board-column"): void;
}>();

const cachedModel = useCachedRef(model);

async function updateColumn(state: IssueBoardColumn) {
    const column = model.value!;
    await blockWithErrorMessage(async () => {
        await requestThrow(updateColumnMutation, {
            input: {
                id: column.id,
                name: state.name,
                description: state.description
            }
        });
        // the states are not part of the update input, they are modified with dedicated mutations.
        // removals run first, so that moving a state between two columns of the same board does not
        // transiently violate the "a state belongs to at most one column" constraint.
        await removeIssueStatesFromColumn(
            column.id,
            column.issueStates.filter((id) => !state.issueStates.includes(id))
        );
        await addIssueStatesToColumn(
            column.id,
            state.issueStates.filter((id) => !column.issueStates.includes(id))
        );
    }, "Error updating column");
    updateColumnDialog.value = false;
    emit("updated-issue-board-column");
}
</script>
