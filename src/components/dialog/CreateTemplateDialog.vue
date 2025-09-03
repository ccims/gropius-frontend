<template>
    <v-dialog v-model="createTemplateDialog" persistent width="auto">
        <v-card color="surface-elevated-3" rounded="lger" class="pa-3 create-template-dialog" elevation="0">
            <v-form @submit.prevent="createTemplate">
                <v-card-title class="pl-4">Create template</v-card-title>
                <div class="pa-4">
                    <v-text-field v-model="name" v-bind="nameProps" label="Name" class="mb-1" />
                    <v-select
                        v-model="templateType"
                        v-bind="templateTypeProps"
                        :items="templateTypeOptions"
                        label="Template type"
                        class="mb-1"
                    />
                    <v-textarea v-model="description" v-bind="descriptionProps" label="Description" class="mb-1" />
                    <v-text-field
                        v-model="repositoryURL"
                        v-bind="repositoryURLProps"
                        label="Repository URL"
                        class="mb-1"
                    />
                </div>
                <v-card-actions>
                    <v-spacer />
                    <DefaultButton variant="text" color="" @click="!isDirty && cancelCreateTemplate()">
                        Cancel
                        <ConfirmationDialog
                            v-if="isDirty"
                            title="Discard template?"
                            message="Are you sure you want to discard this template?"
                            confirm-text="Discard"
                            @confirm="cancelCreateTemplate"
                        />
                    </DefaultButton>
                    <DefaultButton variant="text" color="primary" type="submit" :disabled="submitDisabled"
                        >Continue</DefaultButton
                    >
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onEvent } from "@/util/eventBus";
import * as yup from "yup";
import { useForm, useIsFormDirty } from "vee-validate";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { useClient } from "@/graphql/client";
import { toTypedSchema } from "@vee-validate/yup";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import { IdObject } from "@/util/types";

const createTemplateDialog = ref(false);
const client = useClient();
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const templateTypeOptions = [
  "Artefact",
  "Component",
  "InterfaceSpecification",
  "Issue",
  "Relation",
];

const emit = defineEmits<{
    (event: "created-template", project: IdObject): void;
}>();

const schema = toTypedSchema(
    yup.object().shape({
        name: yup.string().required().label("Name"),
        templateType: yup.string().required().label("Template type"),
        description: yup.string().notRequired().label("Description"),
        repositoryURL: yup.string().notRequired().label("Repository URL")
    })
);

const { defineField, resetForm, handleSubmit } = useForm({
    validationSchema: schema
});
const isDirty = useIsFormDirty();

const [name, nameProps] = defineField("name", fieldConfig);
const [templateType, templateTypeProps] = defineField("templateType", fieldConfig);
const [description, descriptionProps] = defineField("description", fieldConfig);
const [repositoryURL, repositoryURLProps] = defineField("repositoryURL", fieldConfig);

onEvent("create-issue-template", () => {
    resetForm();
    createTemplateDialog.value = true;
});

const createTemplate = handleSubmit(async (state) => {
    const project = await blockWithErrorMessage(async () => {
        const res = await client.createTemplate({
            input: {
                ...state,
                description: state.description ?? ""
            }
        });
        return res.createProject.project;
    }, "Error creating template");
    createTemplateDialog.value = false;
    emit("created-template", project);
});

function cancelCreateTemplate() {
    createTemplateDialog.value = false;
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
.create-template-dialog {
    width: min(1000px, calc(100vw - 3 * settings.$side-bar-width));
}
</style>
