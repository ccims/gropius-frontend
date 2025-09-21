<template>
    <v-card color="surface-elevated-3" rounded="lger" class="pa-3 update-legal-information-content" elevation="0">
        <v-form @submit.prevent="submitChanges">
            <v-card-title class="pl-4">{{ title }}</v-card-title>
            <div class="pa-4">
                <div class="d-flex flex-wrap mx-n2">
                    <v-text-field
                        v-model="label"
                        v-bind="labelProps"
                        label="Label"
                        class="wrap-input mx-2 mb-1 flex-1-1-0"
                    />
                    <v-number-input
                        v-model="priority"
                        v-bind="priorityProps"
                        label="Priority"
                        class="wrap-input mx-2 mb-1 flex-1-1-0"
                    />
                </div>
                <SimpleField
                    v-model="text"
                    v-bind="textProps"
                    variant="outlined"
                    label="Text"
                    color="primary"
                    class="markdown-field"
                >
                    <Markdown v-model="text" v-bind="textProps" edit-mode editable class="w-100 ma-2 markdown" />
                </SimpleField>
            </div>
            <v-card-actions>
                <v-spacer />
                <DefaultButton variant="text" color="" @click="!meta.dirty && $emit('cancel')">
                    Cancel
                    <ConfirmationDialog
                        v-if="meta.dirty"
                        :title="discardTitle"
                        :message="discardMessage"
                        confirm-text="Discard"
                        @confirm="$emit('cancel')"
                    />
                </DefaultButton>
                <DefaultButton variant="text" color="primary" type="submit" :disabled="submitDisabled">{{
                    submitAction
                }}</DefaultButton>
            </v-card-actions>
        </v-form>
    </v-card>
</template>
<script lang="ts" setup>
import * as yup from "yup";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import SimpleField from "@/components/input/SimpleField.vue";
import Markdown from "@/components/Markdown.vue";
import { PropType } from "vue";
import { watch } from "vue";

export interface LegalInformation {
    label: string;
    priority: number;
    text: string;
}

const emit = defineEmits<{
    (event: "submit", legalInformation: LegalInformation): void;
    (event: "cancel"): void;
}>();

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    discardTitle: {
        type: String,
        required: true
    },
    discardMessage: {
        type: String,
        required: true
    },
    submitAction: {
        type: String,
        required: true
    },
    initialValue: {
        type: Object as PropType<LegalInformation>,
        required: true
    },
    submitDisabled: {
        type: Boolean,
        required: false,
        default: false
    }
});

watch(
    () => props.initialValue,
    (value) => {
        resetForm({
            values: value
        });
    }
);

const schema = toTypedSchema(
    yup.object().shape({
        label: yup.string().required().label("Label"),
        priority: yup.number().required().integer().label("Priority"),
        text: yup.string().required().label("Text")
    })
);

const { defineField, handleSubmit, meta, resetForm } = useForm({
    validationSchema: schema,
    initialValues: props.initialValue
});

const [label, labelProps] = defineField("label", fieldConfig);
const [priority, priorityProps] = defineField("priority", fieldConfig);
const [text, textProps] = defineField("text", fieldConfig);

const submitChanges = handleSubmit(async (state) => {
    emit("submit", {
        ...state
    });
});
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
.update-legal-information-content {
    width: min(1000px, calc(100vw - 3 * settings.$side-bar-width));
}

.wrap-input {
    min-width: 250px;
}

.markdown {
    min-width: 0;
}

:deep(.markdown-field .v-field-label) {
    top: 65px;
}
</style>
