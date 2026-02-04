<template>
    <v-dialog v-model="importIssueDialog" persistent width="auto">
        <ImportDialogContent
            item-name="issue"
            confirmation-message="Import issue"
            :submit-disabled="submitDisabled"
            @cancel="importIssueDialog = false"
            @import="importIssue($event as IdObject)"
        >
            <template #select="{ selectedItem }">
                <ExternalIssueAutocomplete
                    hide-details
                    autofocus
                    menu-mode="repeating"
                    :menu-delay="350"
                    @selected-item="selectedItem"
                />
            </template>
            <template #display="{ item }">
                <Issue :issue="<DefaultIssueInfoFragment>item" class="d-block" />
            </template>
        </ImportDialogContent>
    </v-dialog>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { onEvent } from "@/util/eventBus";
import { ref } from "vue";
import ImportDialogContent from "./ImportDialogContent.vue";
import ExternalIssueAutocomplete from "../input/ExternalIssueAutocomplete.vue";
import Issue from "../info/Issue.vue";
import { DefaultIssueInfoFragment } from "@/gql/graphql";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { IdObject } from "@/util/types";

const addIssueToTrackableMutation = graphql(`
    mutation addIssueToTrackableForImport($issue: ID!, $trackable: ID!) {
        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {
            __typename
        }
    }
`);

const importIssueDialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "imported-issue", issue: IdObject): void;
}>();

const props = defineProps({
    trackable: {
        type: String,
        required: true
    }
});

onEvent("import-issue", () => {
    importIssueDialog.value = true;
});

async function importIssue(issue: IdObject) {
    blockWithErrorMessage(async () => {
        await requestThrow(addIssueToTrackableMutation, {
            issue: issue.id,
            trackable: props.trackable
        });
        importIssueDialog.value = false;
        emit("imported-issue", issue);
    }, "Error importing issue");
}
</script>
