<template>
    <v-dialog v-model="createIMSDialog" persistent width="auto">
        <TemplatedNodeDialogContent
            item-name="IMS"
            confirmation-message="Create IMS"
            :form-meta="meta"
            :form-validate="validate"
            :submit-disabled="submitDisabled"
            color="surface-elevated-3"
            @cancel="cancelCreateIMS"
            @confirm="createIMS"
        >
            <template #general>
                <div class="d-flex flex-wrap mx-n2">
                    <v-text-field
                        v-model="name"
                        v-bind="nameProps"
                        label="Name"
                        class="wrap-input mx-2 mb-1 flex-1-1-0"
                    />
                    <IMSTemplateAutocomplete
                        v-model="template"
                        v-bind="templateProps"
                        class="wrap-input mx-2 mb-1 flex-1-1-0"
                    />
                </div>
                <v-textarea v-model="description" v-bind="descriptionProps" label="Description" class="mb-1" />
            </template>
            <template #templatedFields>
                <TemplatedFieldsInput
                    v-if="templateValue != undefined"
                    :schema="templateValue.templateFieldSpecifications"
                    :model-value="templatedFields"
                />
            </template>
        </TemplatedNodeDialogContent>
    </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onEvent } from "@/util/eventBus";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { useBlockingWithErrorMessage, withErrorMessage } from "@/util/withErrorMessage";
import { NodeReturnType, useClient } from "@/graphql/client";
import { toTypedSchema } from "@vee-validate/yup";
import IMSTemplateAutocomplete from "../input/IMSTemplateAutocomplete.vue";
import TemplatedNodeDialogContent from "./TemplatedNodeDialogContent.vue";
import TemplatedFieldsInput, { Field } from "../input/schema/TemplatedFieldsInput.vue";
import { computedAsync } from "@vueuse/core";
import { generateDefaultData } from "../input/schema/generateDefaultData";
import { watch } from "vue";
import { IdObject } from "@/util/types";

const createIMSDialog = ref(false);
const client = useClient();
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "created-ims", ims: IdObject): void;
}>();

const schema = toTypedSchema(
    yup.object().shape({
        name: yup.string().required().label("Name"),
        template: yup.string().required().label("Template"),
        description: yup.string().notRequired().label("Description")
    })
);

const { defineField, resetForm, handleSubmit, meta, validate } = useForm({
    validationSchema: schema
});

const [name, nameProps] = defineField("name", fieldConfig);
const [template, templateProps] = defineField("template", fieldConfig);
const [description, descriptionProps] = defineField("description", fieldConfig);

const templatedFields = ref<Field[]>([]);
const templateValue = computedAsync(
    async () => {
        if (template.value == null) {
            return null;
        }
        const templateRes = await withErrorMessage(async () => {
            return client.getIMSTemplate({ id: template.value! });
        }, "Error loading template");
        const templateNode = templateRes.node as NodeReturnType<"getIMSTemplate", "IMSTemplate">;
        return templateNode;
    },
    null,
    { shallow: false }
);
watch(templateValue, (newValue, oldValue) => {
    if (newValue != null && newValue.id != oldValue?.id) {
        templatedFields.value = newValue.templateFieldSpecifications.map((spec) => ({
            name: spec.name,
            value: generateDefaultData(spec.value, spec.value)
        }));
    }
});

onEvent("create-ims", () => {
    resetForm();
    createIMSDialog.value = true;
});

const createIMS = handleSubmit(async (state) => {
    const ims = await blockWithErrorMessage(async () => {
        const res = await client.createIMS({
            input: {
                ...state,
                description: state.description ?? "",
                templatedFields: templatedFields.value
            }
        });
        return res.createIMS.ims;
    }, "Error creating IMS");
    createIMSDialog.value = false;
    emit("created-ims", ims);
});

function cancelCreateIMS() {
    createIMSDialog.value = false;
}
</script>
<style scoped>
.wrap-input {
    min-width: 250px;
}
</style>
