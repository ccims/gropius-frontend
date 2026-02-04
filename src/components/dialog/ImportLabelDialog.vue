<template>
    <v-dialog v-model="importLabelDialog" persistent width="auto">
        <ImportDialogContent
            item-name="label"
            confirmation-message="Import label"
            :submit-disabled="submitDisabled"
            @cancel="importLabelDialog = false"
            @import="importLabel($event as IdObject)"
        >
            <template #select="{ selectedItem }">
                <ExternalLabelAutocomplete
                    hide-details
                    autofocus
                    menu-mode="repeating"
                    :menu-delay="350"
                    @selected-item="selectedItem"
                />
            </template>
            <template #display="{ item }">
                <Label :label="<DefaultLabelInfoFragment>item" />
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
import ExternalLabelAutocomplete from "../input/ExternalLabelAutocomplete.vue";
import Label from "../info/Label.vue";
import { DefaultLabelInfoFragment } from "@/gql/graphql";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { IdObject } from "@/util/types";

const addLabelToTrackableMutation = graphql(`
    mutation addLabelToTrackable($trackable: ID!, $label: ID!) {
        addLabelToTrackable(input: { label: $label, trackable: $trackable }) {
            __typename
        }
    }
`);

const importLabelDialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "imported-label", label: IdObject): void;
}>();

const props = defineProps({
    trackable: {
        type: String,
        required: true
    }
});

onEvent("import-label", () => {
    importLabelDialog.value = true;
});

async function importLabel(label: IdObject) {
    blockWithErrorMessage(async () => {
        await requestThrow(addLabelToTrackableMutation, {
            label: label.id,
            trackable: props.trackable
        });
        importLabelDialog.value = false;
        emit("imported-label", label);
    }, "Error importing label");
}
</script>
