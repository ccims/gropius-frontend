<template>
    <v-dialog v-model="model" persistent width="auto">
        <v-card color="surface-elevated-3" rounded="lger" class="pa-3 create-template-dialog" elevation="0">
            <v-card-title class="pl-4">{{ title }}</v-card-title>
            <v-stepper
                class="d-flex flex-column"
                v-model="step"
                :items="stepLabels"
                hide-actions
                bg-color="surface-elevated-3"
                flat
            >
                <template v-for="definition in stepsWithSlots" :key="definition.slot" #[definition.stepperSlot]>
                    <div v-if="definition.slot == 'general'">
                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                    v-model="name"
                                    v-bind="nameProps"
                                    label="Name"
                                    class="mb-2"
                                    :messages="nameAlreadyExists ? ['⚠️ A template with this name already exists'] : []"
                                />
                            </v-col>
                            <v-col cols="6">
                                <TemplateAutocomplete
                                    v-model="extendedTemplateIds"
                                    :type="type"
                                    multiple
                                    label="Extended Templates"
                                    :error-messages="inheritanceErrorMessage"
                                />
                            </v-col>
                        </v-row>
                        <v-textarea
                            v-model="description"
                            v-bind="descriptionProps"
                            label="Description"
                            auto-grow
                            rows="2"
                        />
                    </div>
                    <TemplateFieldSpecificationsInput
                        v-else-if="definition.slot == 'fieldSpecifications'"
                        v-model="fieldSpecifications"
                        :inherited-names="inheritedFieldNames"
                    />
                    <slot v-else :name="definition.slot" />
                </template>
            </v-stepper>

            <v-card-actions>
                <DefaultButton variant="text" color="" :disabled="step == 1" @click="previous">Previous</DefaultButton>
                <v-spacer />
                <DefaultButton variant="text" color="" @click="!isDirty && cancel()">
                    Cancel
                    <ConfirmationDialog
                        v-if="isDirty"
                        :title="`Discard ${entityName}?`"
                        :message="`Are you sure you want to discard this ${entityName}?`"
                        confirm-text="Discard"
                        @confirm="cancel"
                    />
                </DefaultButton>
                <DefaultButton variant="text" color="primary" :disabled="isLastStep && submitDisabled" @click="next">
                    {{ isLastStep ? "Create" : "Next" }}
                </DefaultButton>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { JsonFieldInput } from "@/gql/graphql";
import { searchTemplates, type SearchableTemplateType } from "@/util/templateSearch";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { withErrorMessage } from "@/util/withErrorMessage";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { computed, ref, watch, type PropType } from "vue";
import * as yup from "yup";
import TemplateAutocomplete from "../input/TemplateAutocomplete.vue";
import TemplateFieldSpecificationsInput from "../input/TemplateFieldSpecificationsInput.vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";

/**
 * A step of the dialog. `general` and `fieldSpecifications` are provided by the dialog itself,
 * every other slot is rendered from a slot of the same name.
 */
export interface CreateTemplateStep {
    label: string;
    slot: string;
}

/** The part of a create template input this dialog collects */
export interface CreateTemplateInput {
    name: string;
    description: string;
    extends: string[];
    templateFieldSpecifications: JsonFieldInput[];
}

const getExtendedTemplateQuery = graphql(`
    query getExtendedTemplate($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on Template {
                name
                templateFieldSpecifications {
                    name
                    value
                }
            }
        }
    }
`);

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    /** Singular name of the created template, used in the discard confirmation */
    entityName: {
        type: String,
        required: true
    },
    type: {
        type: String as PropType<SearchableTemplateType>,
        required: true
    },
    steps: {
        type: Array as PropType<CreateTemplateStep[]>,
        required: true
    },
    /** Blocks the create button while the create mutation is running or the additional steps are incomplete */
    submitDisabled: {
        type: Boolean,
        required: false,
        default: false
    }
});

const emit = defineEmits<{
    (event: "create", input: CreateTemplateInput): void;
}>();

const model = defineModel({ type: Boolean, required: true });

const step = ref(1);
const stepLabels = computed(() => props.steps.map((definition) => definition.label));
// v-stepper renders the content of its nth item into the `item.n` slot
const stepsWithSlots = computed(() =>
    props.steps.map((definition, index) => ({ ...definition, stepperSlot: `item.${index + 1}` }))
);
const isLastStep = computed(() => step.value == props.steps.length);

const schema = toTypedSchema(
    yup.object({
        name: yup.string().required().label("Name"),
        description: yup.string().notRequired().label("Description")
    })
);

const { defineField, resetForm, meta, validate } = useForm({ validationSchema: schema });
const [name, nameProps] = defineField("name", fieldConfig);
const [description, descriptionProps] = defineField("description", fieldConfig);

const extendedTemplateIds = ref<string[]>([]);
const extendedTemplates = ref<{ id: string; name: string; templateFieldSpecifications: JsonFieldInput[] }[]>([]);
const ownFieldSpecifications = ref<JsonFieldInput[]>([]);

const nameAlreadyExists = ref(false);
watch(name, async (newName) => {
    if (!newName) {
        nameAlreadyExists.value = false;
        return;
    }
    const templates = await withErrorMessage(
        () => searchTemplates(props.type, newName, 5),
        "Error searching templates"
    );
    nameAlreadyExists.value = templates.some((template) => template.name == newName);
});

watch(extendedTemplateIds, async (ids) => {
    extendedTemplates.value = await withErrorMessage(async () => {
        const templates = await Promise.all(ids.map((id) => requestThrow(getExtendedTemplateQuery, { id })));
        return templates
            .map((result) => result.node)
            .filter((node) => node != undefined && "templateFieldSpecifications" in node)
            .map((node) => ({
                id: node.id,
                name: node.name,
                templateFieldSpecifications: node.templateFieldSpecifications
            }));
    }, "Error loading extended templates");
});

/** Field name to the name of the extended template defining it */
const inheritedFields = computed(() => {
    const fields = new Map<string, { templateName: string; value: any }>();
    for (const template of extendedTemplates.value) {
        for (const field of template.templateFieldSpecifications) {
            if (!fields.has(field.name)) {
                fields.set(field.name, { templateName: template.name, value: field.value });
            }
        }
    }
    return fields;
});

const inheritedFieldNames = computed(() => [...inheritedFields.value.keys()]);

// the backend requires the field specifications of all extended templates to be disjoint
const inheritanceErrorMessage = computed(() => {
    const definedBy = new Map<string, string>();
    for (const template of extendedTemplates.value) {
        for (const field of template.templateFieldSpecifications) {
            const other = definedBy.get(field.name);
            if (other != undefined) {
                return `${template.name} and ${other} both define the field "${field.name}"`;
            }
            definedBy.set(field.name, template.name);
        }
    }
    for (const field of ownFieldSpecifications.value) {
        const other = definedBy.get(field.name);
        if (other != undefined) {
            return `${other} already defines the field "${field.name}"`;
        }
    }
    return "";
});

// the inherited specifications are shown read only next to the ones defined here
const fieldSpecifications = computed({
    get: () => [
        ...ownFieldSpecifications.value,
        ...[...inheritedFields.value].map(([fieldName, { value }]) => ({ name: fieldName, value }))
    ],
    set: (value: JsonFieldInput[]) => {
        ownFieldSpecifications.value = value.filter((field) => !inheritedFields.value.has(field.name));
    }
});

const isDirty = computed(
    () =>
        step.value > 1 ||
        meta.value.dirty ||
        extendedTemplateIds.value.length > 0 ||
        ownFieldSpecifications.value.length > 0
);

watch(model, (opened) => {
    if (opened) {
        resetForm();
        step.value = 1;
        extendedTemplateIds.value = [];
        extendedTemplates.value = [];
        ownFieldSpecifications.value = [];
        nameAlreadyExists.value = false;
    }
});

async function next() {
    if (props.steps[step.value - 1].slot == "general") {
        if (!meta.value.valid) {
            await validate();
            return;
        }
        if (inheritanceErrorMessage.value) {
            return;
        }
    }
    if (!isLastStep.value) {
        step.value++;
        return;
    }
    if (inheritanceErrorMessage.value) {
        return;
    }
    emit("create", {
        name: name.value!,
        description: description.value ?? "",
        extends: extendedTemplateIds.value,
        // the backend copies the specifications of the extended templates over on its own
        templateFieldSpecifications: ownFieldSpecifications.value
    });
}

function previous() {
    if (step.value > 1) {
        step.value--;
    }
}

function cancel() {
    model.value = false;
}
</script>

<style scoped lang="scss">
@use "@/styles/settings.scss";

.create-template-dialog {
    width: min(1000px, calc(100vw - 3 * settings.$side-bar-width));
}

// the global stepper window inset from App.vue must not apply to nested windows like the icon picker
.create-template-dialog :deep(.v-stepper .v-window:not(.v-stepper-window)) {
    margin: 0;
    padding: 0;
}
</style>
