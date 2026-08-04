<template>
    <CreateTemplateDialog
        v-model="dialog"
        title="Create Relation Template"
        entity-name="relation template"
        type="relation"
        :steps="steps"
        :submit-disabled="submitDisabled"
        @create="createRelationTemplate"
    >
        <template #appearance>
            <TemplateStyleInput v-model="style" marker />
        </template>
        <template #relationConditions>
            <RelationConditionsInput v-model="relationConditions" />
        </template>
    </CreateTemplateDialog>
</template>

<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { CreateRelationTemplateInput } from "@/gql/graphql";
import { onEvent } from "@/util/eventBus";
import type { IdObject } from "@/util/types";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { ref } from "vue";
import RelationConditionsInput, { type RelationConditionState } from "../input/RelationConditionsInput.vue";
import TemplateStyleInput from "../input/TemplateStyleInput.vue";
import { defaultTemplateStyle, strokeStyleInput } from "@/util/templateInputs";
import CreateTemplateDialog, { type CreateTemplateInput, type CreateTemplateStep } from "./CreateTemplateDialog.vue";

const createRelationTemplateMutation = graphql(`
    mutation createRelationTemplate($input: CreateRelationTemplateInput!) {
        createRelationTemplate(input: $input) {
            relationTemplate {
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
    { label: "Appearance", slot: "appearance" },
    { label: "Relation Conditions", slot: "relationConditions" },
    { label: "Template Field Specifications", slot: "fieldSpecifications" }
];

const dialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const style = ref(defaultTemplateStyle());
const relationConditions = ref<RelationConditionState[]>([]);

onEvent("create-relation-template", () => {
    style.value = defaultTemplateStyle();
    relationConditions.value = [];
    dialog.value = true;
});

async function createRelationTemplate(input: CreateTemplateInput) {
    const template = await blockWithErrorMessage(async () => {
        // the type annotation is what rejects fields the input does not have, requestThrow does not check its variables
        const relationTemplateInput: CreateRelationTemplateInput = {
            ...input,
            isAbstract: false,
            markerType: style.value.markerType,
            stroke: strokeStyleInput(style.value),
            relationConditions: relationConditions.value
        };
        const res = await requestThrow(createRelationTemplateMutation, { input: relationTemplateInput });
        return res.createRelationTemplate.relationTemplate;
    }, "Error creating relation template");
    dialog.value = false;
    emit("created-template", template);
}
</script>
