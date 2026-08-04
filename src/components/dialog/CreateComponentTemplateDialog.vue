<template>
    <CreateTemplateDialog
        v-model="dialog"
        title="Create Component Template"
        entity-name="component template"
        type="component"
        :steps="steps"
        :submit-disabled="submitDisabled"
        @create="createComponentTemplate"
    >
        <template #appearance>
            <TemplateStyleInput v-model="style" shape />
        </template>
        <template #dependencyTypes>
            <div class="text-medium-emphasis mb-4">
                Types the dependencies between the interfaces of a component with this template can have, like CALLS.
            </div>
            <NamedNodeListInput
                v-model="dependencyTypes"
                type="dependencyType"
                add-label="Add Dependency Type"
                add-icon="mdi-arrow-decision"
            />
        </template>
        <template #componentVersion>
            <SubTemplateInput
                v-model="componentVersionTemplate"
                description="Applies to all versions of components with this template."
            />
        </template>
    </CreateTemplateDialog>
</template>

<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { CreateComponentTemplateInput } from "@/gql/graphql";
import { onEvent } from "@/util/eventBus";
import type { IdObject } from "@/util/types";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { ref } from "vue";
import NamedNodeListInput, { type NamedNodeState } from "../input/NamedNodeListInput.vue";
import SubTemplateInput from "../input/SubTemplateInput.vue";
import TemplateStyleInput from "../input/TemplateStyleInput.vue";
import {
    defaultTemplateStyle,
    emptySubTemplate,
    fillStyleInput,
    strokeStyleInput,
    type SubTemplateState
} from "@/util/templateInputs";
import CreateTemplateDialog, { type CreateTemplateInput, type CreateTemplateStep } from "./CreateTemplateDialog.vue";

const createComponentTemplateMutation = graphql(`
    mutation createComponentTemplate($input: CreateComponentTemplateInput!) {
        createComponentTemplate(input: $input) {
            componentTemplate {
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
    { label: "Dependency Types", slot: "dependencyTypes" },
    { label: "Template Field Specifications", slot: "fieldSpecifications" },
    { label: "Component Version", slot: "componentVersion" }
];

const dialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const style = ref(defaultTemplateStyle());
const dependencyTypes = ref<NamedNodeState[]>([]);
const componentVersionTemplate = ref<SubTemplateState>(emptySubTemplate("Component Version"));

onEvent("create-component-template", () => {
    style.value = defaultTemplateStyle();
    dependencyTypes.value = [];
    componentVersionTemplate.value = emptySubTemplate("Component Version");
    dialog.value = true;
});

async function createComponentTemplate(input: CreateTemplateInput) {
    const template = await blockWithErrorMessage(async () => {
        // the type annotation is what rejects fields the input does not have, requestThrow does not check its variables
        const componentTemplateInput: CreateComponentTemplateInput = {
            ...input,
            isAbstract: false,
            shapeType: style.value.shapeType,
            shapeRadius: style.value.shapeRadius ?? undefined,
            fill: fillStyleInput(style.value),
            stroke: strokeStyleInput(style.value),
            intraComponentDependencySpecificationTypes: dependencyTypes.value,
            componentVersionTemplate: componentVersionTemplate.value
        };
        const res = await requestThrow(createComponentTemplateMutation, { input: componentTemplateInput });
        return res.createComponentTemplate.componentTemplate;
    }, "Error creating component template");
    dialog.value = false;
    emit("created-template", template);
}
</script>
