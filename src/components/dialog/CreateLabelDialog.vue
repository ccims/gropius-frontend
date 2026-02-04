<template>
    <v-dialog v-model="createLabelDialog" persistent width="auto">
        <LabelDialogContent
            title="Create label"
            discard-title="Discard label?"
            discard-message="Are you sure you want to discard this label?"
            submit-action="Create label"
            :trackable="trackable"
            :initial-value="initialValue"
            :submit-disabled="submitDisabled"
            @submit="createLabel"
            @cancel="createLabelDialog = false"
        />
    </v-dialog>
</template>
<script lang="ts" setup>
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { onEvent } from "@/util/eventBus";
import { ref, watch } from "vue";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import LabelDialogContent, { Label } from "./LabelDialogContent.vue";
import { DefaultLabelInfoFragment } from "@/gql/graphql";

const createLabelMutation = graphql(`
    mutation createLabel($input: CreateLabelInput!) {
        createLabel(input: $input) {
            label {
                ...DefaultLabelInfo
            }
        }
    }
`);

const createLabelDialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "created-label", label: DefaultLabelInfoFragment): void;
}>();

const props = defineProps({
    trackable: {
        type: String,
        required: true
    },
    initialName: {
        type: String,
        required: false
    }
});

const initialValue = ref({
    name: "",
    description: "",
    color: "#0c94d8"
});

watch(
    () => props.initialName,
    (newValue) => {
        if (newValue != undefined) {
            initialValue.value.name = newValue;
        }
    }
);

onEvent("create-label", () => {
    createLabelDialog.value = true;
});

async function createLabel(state: Label) {
    const label = await blockWithErrorMessage(async () => {
        const res = await requestThrow(createLabelMutation, {
            input: {
                ...state,
                trackables: [props.trackable]
            }
        });
        return res.createLabel.label;
    }, "Error creating label");
    createLabelDialog.value = false;
    emit("created-label", label);
}
</script>
