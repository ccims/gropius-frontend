<template>
    <v-dialog v-model="updateLabelDialog" persistent width="auto">
        <LabelDialogContent
            v-if="model != undefined"
            title="Update label"
            discard-title="Discard changes?"
            discard-message="Are you sure you want to discard the changes?"
            submit-action="Update label"
            :trackable="trackable"
            :initial-value="model"
            :submit-disabled="submitDisabled"
            @submit="updateLabel"
            @cancel="updateLabelDialog = false"
        />
    </v-dialog>
</template>
<script lang="ts" setup>
import { useClient } from "@/graphql/client";
import { PropType } from "vue";
import { useBlockingWithErrorMessage, withErrorMessage } from "@/util/withErrorMessage";
import LabelDialogContent, { Label } from "./LabelDialogContent.vue";
import { computed } from "vue";
import { IdObject } from "@/util/types";

const updateLabelDialog = computed({
    get: () => model.value != null,
    set: (value) => {
        if (!value) {
            model.value = null;
        }
    }
});
const client = useClient();
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "updated-label", label: IdObject): void;
}>();

defineProps({
    trackable: {
        type: String,
        required: true
    }
});

const model = defineModel({
    type: Object as PropType<(Label & IdObject) | null>,
    required: false
});

async function updateLabel(state: Label) {
    const label = await blockWithErrorMessage(async () => {
        const res = await client.updateLabel({
            input: {
                ...state,
                id: model.value!.id
            }
        });
        return res.updateLabel.label;
    }, "Error updating label");
    updateLabelDialog.value = false;
    emit("updated-label", label);
}
</script>
