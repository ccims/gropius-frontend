<template>
    <v-dialog v-model="updateLegalInformationDialog" persistent width="auto">
        <LegalInformationDialogContent
            v-if="cachedModel != undefined"
            title="Update legal information"
            discard-title="Discard changes?"
            discard-message="Are you sure you want to discard the changes?"
            submit-action="Update legal information"
            :initial-value="cachedModel"
            :submit-disabled="submitDisabled"
            @submit="updateLegalInformation"
            @cancel="updateLegalInformationDialog = false"
        />
    </v-dialog>
</template>
<script lang="ts" setup>
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { PropType } from "vue";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import LegalInformationDialogContent, { LegalInformation } from "./LegalInformationDialogContent.vue";
import { computed } from "vue";
import { IdObject } from "@/util/types";
import { useCachedRef } from "@/util/useCachedRef";

const updateLegalInformationMutation = graphql(`
    mutation updateLegalInformationForDialog($input: UpdateLegalInformationInput!) {
        updateLegalInformation(input: $input) {
            legalInformation {
                id
            }
        }
    }
`);

const updateLegalInformationDialog = computed({
    get: () => model.value != null,
    set: (value) => {
        if (!value) {
            model.value = null;
        }
    }
});
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "updated-legal-information", legalInformation: IdObject): void;
}>();

const model = defineModel({
    type: Object as PropType<(LegalInformation & IdObject) | null>,
    required: false
});

const cachedModel = useCachedRef(model);

async function updateLegalInformation(state: LegalInformation) {
    const legalInformation = await blockWithErrorMessage(async () => {
        const res = await requestThrow(updateLegalInformationMutation, {
            input: {
                ...state,
                id: model.value!.id
            }
        });
        return res.updateLegalInformation.legalInformation;
    }, "Error updating legal information");
    updateLegalInformationDialog.value = false;
    emit("updated-legal-information", legalInformation);
}
</script>
