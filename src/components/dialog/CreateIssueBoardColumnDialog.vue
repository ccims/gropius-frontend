<template>
    <v-dialog v-model="createColumnDialog" persistent width="auto">
        <IssueBoardColumnDialogContent
            title="Create column"
            discard-title="Discard column?"
            discard-message="Are you sure you want to discard this column?"
            submit-action="Create column"
            :initial-value="initialValue"
            :submit-disabled="submitDisabled"
            @submit="createColumn"
            @cancel="createColumnDialog = false"
        />
    </v-dialog>
</template>
<script lang="ts" setup>
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { onEvent } from "@/util/eventBus";
import { ref } from "vue";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import IssueBoardColumnDialogContent, {
    type IssueBoardColumn,
    type IssueBoardColumnInitialValue
} from "./IssueBoardColumnDialogContent.vue";
import { addIssueStatesToColumn } from "@/util/issueBoardColumnStates";

const createColumnMutation = graphql(`
    mutation createIssueBoardColumn($input: CreateIssueBoardColumnInput!) {
        createIssueBoardColumn(input: $input) {
            issueBoardColumn {
                id
            }
        }
    }
`);

const createColumnDialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "created-issue-board-column"): void;
}>();

const props = defineProps({
    issueBoard: {
        type: String,
        required: true
    },
    nextPosition: {
        type: Number,
        required: true
    }
});

const initialValue = ref<IssueBoardColumnInitialValue>({
    name: "",
    description: "",
    issueStates: [],
    initialStates: []
});

onEvent("create-issue-board-column", () => {
    initialValue.value = { name: "", description: "", issueStates: [], initialStates: [] };
    createColumnDialog.value = true;
});

async function createColumn(state: IssueBoardColumn) {
    await blockWithErrorMessage(async () => {
        const res = await requestThrow(createColumnMutation, {
            input: {
                name: state.name,
                description: state.description,
                issueBoard: props.issueBoard,
                position: props.nextPosition
            }
        });
        await addIssueStatesToColumn(res.createIssueBoardColumn.issueBoardColumn.id, state.issueStates);
    }, "Error creating column");
    createColumnDialog.value = false;
    emit("created-issue-board-column");
}
</script>
