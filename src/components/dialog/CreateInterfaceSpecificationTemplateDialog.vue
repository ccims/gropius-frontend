<template>
    <CreateTemplateDialog
        v-model="dialog"
        title="Create Interface Specification Template"
        entity-name="interface specification template"
        type="interfaceSpecification"
        :steps="steps"
        :submit-disabled="submitDisabled"
        @create="createInterfaceSpecificationTemplate"
    >
        <template #appearance>
            <TemplateStyleInput v-model="style" shape />
        </template>
        <template #components>
            <div class="text-medium-emphasis mb-4">
                Defines which components can provide interface specifications with this template.
            </div>
            <TemplateAutocomplete
                v-model="canBeVisibleOnComponents"
                type="component"
                multiple
                label="Can be visible on components with these templates"
            />
            <TemplateAutocomplete
                v-model="canBeInvisibleOnComponents"
                type="component"
                multiple
                label="Can be invisible on components with these templates"
            />
        </template>
        <template #interfaceSpecificationVersion>
            <SubTemplateInput
                v-model="interfaceSpecificationVersionTemplate"
                description="Applies to all versions of interface specifications with this template."
            />
        </template>
        <template #interfacePart>
            <SubTemplateInput
                v-model="interfacePartTemplate"
                description="Applies to all parts of interface specifications with this template."
            />
        </template>
    </CreateTemplateDialog>
</template>

<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { CreateInterfaceSpecificationTemplateInput } from "@/gql/graphql";
import { onEvent } from "@/util/eventBus";
import type { IdObject } from "@/util/types";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { ref } from "vue";
import SubTemplateInput from "../input/SubTemplateInput.vue";
import TemplateAutocomplete from "../input/TemplateAutocomplete.vue";
import TemplateStyleInput from "../input/TemplateStyleInput.vue";
import {
    defaultTemplateStyle,
    emptySubTemplate,
    fillStyleInput,
    strokeStyleInput,
    type SubTemplateState
} from "@/util/templateInputs";
import CreateTemplateDialog, { type CreateTemplateInput, type CreateTemplateStep } from "./CreateTemplateDialog.vue";

const createInterfaceSpecificationTemplateMutation = graphql(`
    mutation createInterfaceSpecificationTemplate($input: CreateInterfaceSpecificationTemplateInput!) {
        createInterfaceSpecificationTemplate(input: $input) {
            interfaceSpecificationTemplate {
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
    { label: "Components", slot: "components" },
    { label: "Template Field Specifications", slot: "fieldSpecifications" },
    { label: "Interface Specification Version", slot: "interfaceSpecificationVersion" },
    { label: "Interface Part", slot: "interfacePart" }
];

const dialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const style = ref(defaultTemplateStyle());
const canBeVisibleOnComponents = ref<string[]>([]);
const canBeInvisibleOnComponents = ref<string[]>([]);
const interfaceSpecificationVersionTemplate = ref<SubTemplateState>(
    emptySubTemplate("Interface Specification Version")
);
const interfacePartTemplate = ref<SubTemplateState>(emptySubTemplate("Interface Part"));

onEvent("create-interface-specification-template", () => {
    style.value = defaultTemplateStyle();
    canBeVisibleOnComponents.value = [];
    canBeInvisibleOnComponents.value = [];
    interfaceSpecificationVersionTemplate.value = emptySubTemplate("Interface Specification Version");
    interfacePartTemplate.value = emptySubTemplate("Interface Part");
    dialog.value = true;
});

async function createInterfaceSpecificationTemplate(input: CreateTemplateInput) {
    const template = await blockWithErrorMessage(async () => {
        // the type annotation is what rejects fields the input does not have, requestThrow does not check its variables
        const interfaceSpecificationTemplateInput: CreateInterfaceSpecificationTemplateInput = {
            ...input,
            isAbstract: false,
            shapeType: style.value.shapeType,
            shapeRadius: style.value.shapeRadius ?? undefined,
            fill: fillStyleInput(style.value),
            stroke: strokeStyleInput(style.value),
            canBeVisibleOnComponents: canBeVisibleOnComponents.value,
            canBeInvisibleOnComponents: canBeInvisibleOnComponents.value,
            interfaceSpecificationVersionTemplate: interfaceSpecificationVersionTemplate.value,
            interfacePartTemplate: interfacePartTemplate.value
        };
        const res = await requestThrow(createInterfaceSpecificationTemplateMutation, {
            input: interfaceSpecificationTemplateInput
        });
        return res.createInterfaceSpecificationTemplate.interfaceSpecificationTemplate;
    }, "Error creating interface specification template");
    dialog.value = false;
    emit("created-template", template);
}
</script>
