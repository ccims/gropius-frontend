<template>
    <v-dialog v-model="createIssueDialog" persistent width="auto">
        <v-card color="surface-elevated-3" rounded="lger" class="pa-3 create-issue-dialog" elevation="0">
            <v-form @submit.prevent="createIssue">
                <v-card-title class="p4-3">Create issue</v-card-title>
                <div class="pa-4">
                    <v-text-field v-bind="title" label="Title" class="mb-1" />
                    <div class="d-flex flex-wrap mx-n2">
                        <IssueTemplateAutocomplete v-bind="template" class="wrap-input mx-2 mb-1 flex-1-1-0" />
                        <IssueTypeAutocomplete
                            v-bind="type"
                            :template="template.modelValue"
                            :disabled="!template.modelValue"
                            class="wrap-input mx-2 mb-1 flex-1-1-0"
                        />
                        <IssueStateAutocomplete
                            v-bind="state"
                            :template="template.modelValue"
                            :disabled="!template.modelValue"
                            class="wrap-input mx-2 mb-1 flex-1-1-0"
                        />
                    </div>
                    <SimpleField
                        :model-value="body"
                        variant="outlined"
                        label="Body"
                        color="primary"
                        class="markdown-field"
                    >
                        <Markdown v-model="body" edit-mode class="full-width ma-2" />
                    </SimpleField>
                </div>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" color="">
                        Cancel
                        <ConfirmationDialog
                            title="Discard issue?"
                            message="Are you sure you want to discard this issue?"
                            confirm-text="Discard"
                            @confirm="cancelCreateIssue"
                        />
                    </v-btn>
                    <v-btn variant="text" color="primary" type="submit">Create issue</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import SimpleField from "@/components/input/SimpleField.vue";
import IssueTemplateAutocomplete from "@/components/input/IssueTemplateAutocomplete.vue";
import Markdown from "@/components/Markdown.vue";
import { ref, watch } from "vue";
import { onEvent } from "@/util/eventBus";
import IssueTypeAutocomplete from "../input/IssueTypeAutocomplete.vue";
import IssueStateAutocomplete from "../input/IssueStateAutocomplete.vue";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { wrapBinds } from "@/util/vuetifyFormConfig";
import { withErrorMessage } from "@/util/withErrorMessage";
import { useClient } from "@/graphql/client";
import { toTypedSchema } from "@vee-validate/yup";
import ConfirmationDialog from "./ConfirmationDialog.vue";

const createIssueDialog = ref(false);
const body = ref("");
const client = useClient();

const emit = defineEmits<{
    (event: "created-issue", issue: { id: string }): void;
}>();

const props = defineProps({
    trackable: {
        type: String,
        required: true
    }
});

const schema = toTypedSchema(
    yup.object().shape({
        title: yup.string().required().label("Title"),
        template: yup.string().required().label("Template"),
        type: yup.string().required().label("Type"),
        state: yup.string().required().label("State")
    })
);

const { defineComponentBinds, resetForm, handleSubmit, setValues } = useForm({
    validationSchema: schema
});

const defineBinds = wrapBinds(defineComponentBinds);

const title = defineBinds("title");
const template = defineBinds("template");
const type = defineBinds("type");
const state = defineBinds("state");

onEvent("create-issue", () => {
    resetForm();
    createIssueDialog.value = true;
});

watch(
    () => template.value.modelValue,
    () => {
        setValues({ type: undefined, state: undefined }, false);
    }
);

const createIssue = handleSubmit(async (state) => {
    const issue = await withErrorMessage(async () => {
        const res = await client.createIssue({
            input: {
                body: body.value,
                ...state,
                templatedFields: [],
                trackables: [props.trackable]
            }
        });
        return res.createIssue!.issue!;
    }, "Error creating issue");
    createIssueDialog.value = false;
    emit("created-issue", issue);
});

function cancelCreateIssue() {
    createIssueDialog.value = false;
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
.create-issue-dialog {
    width: min(1000px, calc(100vw - 3 * settings.$side-bar-width));
}

.wrap-input {
    min-width: 200px;
}

:deep(.markdown-field .v-field-label) {
    top: 65px;
}
</style>