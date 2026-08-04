<template>
    <CreateTemplateDialog
        v-model="dialog"
        title="Create Artefact Template"
        entity-name="artefact template"
        type="artefact"
        :steps="steps"
        :submit-disabled="submitDisabled"
        @create="createArtefactTemplate"
    />
</template>

<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { CreateArtefactTemplateInput } from "@/gql/graphql";
import { onEvent } from "@/util/eventBus";
import type { IdObject } from "@/util/types";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { ref } from "vue";
import CreateTemplateDialog, { type CreateTemplateInput, type CreateTemplateStep } from "./CreateTemplateDialog.vue";

const createArtefactTemplateMutation = graphql(`
    mutation createArtefactTemplate($input: CreateArtefactTemplateInput!) {
        createArtefactTemplate(input: $input) {
            artefactTemplate {
                id
            }
        }
    }
`);

const emit = defineEmits<{
    (event: "created-template", template: IdObject): void;
}>();

const steps: CreateTemplateStep[] = [
    { label: "General", slot: "general" },
    { label: "Template Field Specifications", slot: "fieldSpecifications" }
];

const dialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

onEvent("create-artefact-template", () => {
    dialog.value = true;
});

async function createArtefactTemplate(input: CreateTemplateInput) {
    const template = await blockWithErrorMessage(async () => {
        // the type annotation is what rejects fields the input does not have, requestThrow does not check its variables
        const artefactTemplateInput: CreateArtefactTemplateInput = { ...input, isAbstract: false };
        const res = await requestThrow(createArtefactTemplateMutation, { input: artefactTemplateInput });
        return res.createArtefactTemplate.artefactTemplate;
    }, "Error creating artefact template");
    dialog.value = false;
    emit("created-template", template);
}
</script>
