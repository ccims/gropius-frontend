<template>
    <v-dialog v-model="createLegalInformationDialog" persistent width="auto">
        <LegalInformationDialogContent
            title="Create legal information"
            discard-title="Discard legal information?"
            discard-message="Are you sure you want to discard this legal information?"
            submit-action="Create legal information"
            :initial-value="initialValue"
            :submit-disabled="submitDisabled"
            @submit="createLegalInformation"
            @cancel="createLegalInformationDialog = false"
        />
    </v-dialog>
</template>
<script lang="ts" setup>
import { onEvent } from "@/util/eventBus";
import { useClient } from "@/graphql/client";
import { ref } from "vue";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import LegalInformationDialogContent, { LegalInformation } from "./LegalInformationDialogContent.vue";
import { DefaultLegalInformationInfoFragment } from "@/graphql/generated";

const createLegalInformationDialog = ref(false);
const client = useClient();
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "created-legal-information", legalInformation: DefaultLegalInformationInfoFragment): void;
}>();

const initialValue = ref({
    label: "",
    priority: 0,
    text: ""
});

onEvent("create-legal-information", () => {
    createLegalInformationDialog.value = true;
});

async function createLegalInformation(state: LegalInformation) {
    const legalInformation = await blockWithErrorMessage(async () => {
        const res = await client.createLegalInformation({
            input: {
                ...state
            }
        });
        return res.createLegalInformation.legalInformation;
    }, "Error creating legal information");
    createLegalInformationDialog.value = false;
    emit("created-legal-information", legalInformation);
}
</script>
