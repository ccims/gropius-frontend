<template>
    <v-card color="surface-elevated-3" rounded="lger" class="pa-3 issue-board-content" elevation="0">
        <v-form @submit.prevent="submitChanges">
            <v-card-title class="pl-4">{{ title }}</v-card-title>
            <div class="pa-4">
                <v-text-field v-model="name" v-bind="nameProps" label="Name" class="mb-1" />
                <v-textarea v-model="description" v-bind="descriptionProps" label="Description" class="mb-1" />
            </div>
            <v-card-actions>
                <DefaultButton v-if="deletable" variant="text" color="error">
                    Delete
                    <ConfirmationDialog
                        :title="`Delete issue board ${initialValue.name}?`"
                        message="Are you sure you want to delete this issue board? The issues on it are not deleted."
                        confirm-text="Delete"
                        @confirm="$emit('delete')"
                    />
                </DefaultButton>
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
                <DefaultButton variant="text" color="primary" type="submit" :disabled="submitDisabled">
                    {{ submitAction }}
                </DefaultButton>
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
import { watch, type PropType } from "vue";

export interface IssueBoard {
    name: string;
    description: string;
}

const emit = defineEmits<{
    (event: "submit", issueBoard: IssueBoard): void;
    (event: "cancel"): void;
    (event: "delete"): void;
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
        type: Object as PropType<IssueBoard>,
        required: true
    },
    submitDisabled: {
        type: Boolean,
        default: false
    },
    /** If true, the dialog also offers to delete the issue board */
    deletable: {
        type: Boolean,
        default: false
    }
});

watch(
    () => props.initialValue,
    (value) => {
        resetForm({ values: value });
    }
);

const schema = toTypedSchema(
    yup.object().shape({
        name: yup.string().required().label("Name"),
        description: yup.string().notRequired().label("Description")
    })
);

const { defineField, handleSubmit, meta, resetForm } = useForm({
    validationSchema: schema,
    initialValues: props.initialValue
});

const [name, nameProps] = defineField("name", fieldConfig);
const [description, descriptionProps] = defineField("description", fieldConfig);

const submitChanges = handleSubmit(async (state) => {
    emit("submit", {
        ...state,
        description: state.description ?? ""
    });
});
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
.issue-board-content {
    width: min(700px, calc(100vw - 3 * settings.$side-bar-width));
}
</style>
