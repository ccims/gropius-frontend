<template>
    <v-card color="surface-elevated-3" rounded="lger" class="pa-3 issue-board-column-content" elevation="0">
        <v-form @submit.prevent="submitChanges">
            <v-card-title class="pl-4">{{ title }}</v-card-title>
            <div class="pa-4">
                <v-text-field v-model="name" v-bind="nameProps" label="Name" class="mb-1" />
                <v-textarea v-model="description" v-bind="descriptionProps" label="Description" class="mb-1" />
                <IssueStateMultiAutocomplete v-model="issueStates" :initial-items="initialValue.initialStates" />
            </div>
            <v-card-actions>
                <v-spacer />
                <DefaultButton variant="text" color="" @click="!dirty && $emit('cancel')">
                    Cancel
                    <ConfirmationDialog
                        v-if="dirty"
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
import IssueStateMultiAutocomplete from "../input/IssueStateMultiAutocomplete.vue";
import { computed, ref, watch, type PropType } from "vue";
import type { DefaultIssueStateInfoFragment } from "@/gql/graphql";

export interface IssueBoardColumn {
    name: string;
    description: string;
    issueStates: string[];
}

export interface IssueBoardColumnInitialValue extends IssueBoardColumn {
    /**
     * The already assigned states, so that they can be displayed before the autocomplete fetched them
     */
    initialStates: DefaultIssueStateInfoFragment[];
}

const emit = defineEmits<{
    (event: "submit", column: IssueBoardColumn): void;
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
        type: Object as PropType<IssueBoardColumnInitialValue>,
        required: true
    },
    submitDisabled: {
        type: Boolean,
        default: false
    }
});

const issueStates = ref([...props.initialValue.issueStates]);

watch(
    () => props.initialValue,
    (value) => {
        resetForm({ values: value });
        issueStates.value = [...value.issueStates];
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

const statesDirty = computed(() => {
    const initial = props.initialValue.issueStates;
    return issueStates.value.length != initial.length || issueStates.value.some((id) => !initial.includes(id));
});
const dirty = computed(() => meta.value.dirty || statesDirty.value);

const submitChanges = handleSubmit(async (state) => {
    emit("submit", {
        ...state,
        description: state.description ?? "",
        issueStates: [...issueStates.value]
    });
});
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
.issue-board-column-content {
    width: min(700px, calc(100vw - 3 * settings.$side-bar-width));
}
</style>
