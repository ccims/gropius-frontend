<template>
    <v-dialog v-model="updateAttributeDialog" persistent width="auto">
        <v-card
            v-if="cachedModel != undefined"
            color="surface-elevated-3"
            rounded="lger"
            class="pa-3 update-template-attribute-dialog"
            elevation="0"
        >
            <v-form @submit.prevent="submitChanges">
                <v-card-title class="pl-4">Update {{ attributeName }}</v-card-title>
                <div class="pa-4">
                    <v-alert
                        v-if="cachedModel.templateCount > 1"
                        type="warning"
                        variant="tonal"
                        density="compact"
                        class="mb-4"
                    >
                        This {{ attributeName }} is part of {{ cachedModel.templateCount }} templates, the changes apply
                        to all of them.
                    </v-alert>
                    <div class="d-flex flex-wrap mx-n2">
                        <v-text-field
                            v-model="name"
                            v-bind="nameProps"
                            label="Name"
                            class="wrap-input mx-2 mb-1 flex-1-1-0"
                        />
                        <v-text-field
                            v-if="hasInverseName"
                            v-model="inverseName"
                            v-bind="inverseNameProps"
                            label="Inverse name"
                            class="wrap-input mx-2 mb-1 flex-1-1-0"
                        />
                        <v-number-input
                            v-if="hasValue"
                            v-model="value"
                            v-bind="valueProps"
                            :precision="null"
                            label="Value"
                            class="wrap-input mx-2 mb-1 flex-1-1-0"
                        />
                    </div>
                    <v-textarea v-model="description" v-bind="descriptionProps" label="Description" class="mb-1" />
                    <IconPicker v-if="hasIcon" v-model="iconPath" />
                </div>
                <v-card-actions>
                    <v-spacer />
                    <DefaultButton variant="text" color="" @click="!hasChanges && cancel()">
                        Cancel
                        <ConfirmationDialog
                            v-if="hasChanges"
                            title="Discard changes?"
                            message="Are you sure you want to discard the changes?"
                            confirm-text="Discard"
                            @confirm="cancel"
                        />
                    </DefaultButton>
                    <DefaultButton variant="text" color="primary" type="submit" :disabled="submitDisabled">
                        Update {{ attributeName }}
                    </DefaultButton>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { useCachedRef } from "@/util/useCachedRef";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import { computed, ref, watch, type PropType } from "vue";
import * as yup from "yup";
import IconPicker from "../input/IconPicker.vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";

export type TemplateAttributeKind =
    "issueType" | "issuePriority" | "issueState" | "assignmentType" | "issueRelationType";

export interface TemplateAttribute {
    id: string;
    kind: TemplateAttributeKind;
    name: string;
    description: string;
    /** the number of templates this attribute is part of, it is shared between all of them */
    templateCount: number;
    iconPath?: string;
    value?: number;
    inverseName?: string;
}

const attributeNames: Record<TemplateAttributeKind, string> = {
    issueType: "issue type",
    issuePriority: "issue priority",
    issueState: "issue state",
    assignmentType: "assignment type",
    issueRelationType: "relation type"
};

const updateIssueTypeMutation = graphql(`
    mutation updateIssueType($input: UpdateIssueTypeInput!) {
        updateIssueType(input: $input) {
            issueType {
                id
            }
        }
    }
`);

const updateIssuePriorityMutation = graphql(`
    mutation updateIssuePriority($input: UpdateIssuePriorityInput!) {
        updateIssuePriority(input: $input) {
            issuePriority {
                id
            }
        }
    }
`);

const updateIssueStateMutation = graphql(`
    mutation updateIssueState($input: UpdateIssueStateInput!) {
        updateIssueState(input: $input) {
            issueState {
                id
            }
        }
    }
`);

const updateAssignmentTypeMutation = graphql(`
    mutation updateAssignmentType($input: UpdateAssignmentTypeInput!) {
        updateAssignmentType(input: $input) {
            assignmentType {
                id
            }
        }
    }
`);

const updateIssueRelationTypeMutation = graphql(`
    mutation updateIssueRelationType($input: UpdateIssueRelationTypeInput!) {
        updateIssueRelationType(input: $input) {
            issueRelationType {
                id
            }
        }
    }
`);

const emit = defineEmits<{
    (event: "updated-attribute"): void;
}>();

const model = defineModel({
    type: Object as PropType<TemplateAttribute | null>,
    required: false
});

const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const cachedModel = useCachedRef(model);
const kind = computed(() => cachedModel.value?.kind);
const attributeName = computed(() => (kind.value != undefined ? attributeNames[kind.value] : ""));
const hasIcon = computed(() => kind.value == "issueType" || kind.value == "issuePriority");
const hasValue = computed(() => kind.value == "issuePriority");
const hasInverseName = computed(() => kind.value == "issueRelationType");

const updateAttributeDialog = computed({
    get: () => model.value != null,
    set: (value) => {
        if (!value) {
            model.value = null;
        }
    }
});

const iconPath = ref("");

const schema = computed(() =>
    toTypedSchema(
        yup.object().shape({
            name: yup.string().required().label("Name"),
            description: yup.string().notRequired().label("Description"),
            inverseName: hasInverseName.value
                ? yup.string().required().label("Inverse name")
                : yup.string().notRequired().label("Inverse name"),
            value: hasValue.value ? yup.number().required().label("Value") : yup.number().notRequired().label("Value")
        })
    )
);

const { defineField, handleSubmit, meta, resetForm } = useForm({
    validationSchema: schema
});

const [name, nameProps] = defineField("name", fieldConfig);
const [description, descriptionProps] = defineField("description", fieldConfig);
const [inverseName, inverseNameProps] = defineField("inverseName", fieldConfig);
const [value, valueProps] = defineField("value", fieldConfig);

const hasChanges = computed(() => meta.value.dirty || iconPath.value != (cachedModel.value?.iconPath ?? ""));

watch(
    cachedModel,
    (attribute) => {
        if (attribute == undefined) {
            return;
        }
        resetForm({
            values: {
                name: attribute.name,
                description: attribute.description,
                inverseName: attribute.inverseName ?? "",
                value: attribute.value ?? 0
            }
        });
        iconPath.value = attribute.iconPath ?? "";
    },
    { immediate: true }
);

const submitChanges = handleSubmit(async (state) => {
    const attribute = cachedModel.value!;
    const id = attribute.id;
    const name = state.name;
    const description = state.description ?? "";
    await blockWithErrorMessage(async () => {
        switch (attribute.kind) {
            case "issueType":
                await requestThrow(updateIssueTypeMutation, {
                    input: { id, name, description, iconPath: iconPath.value }
                });
                break;
            case "issuePriority":
                await requestThrow(updateIssuePriorityMutation, {
                    input: { id, name, description, iconPath: iconPath.value, value: state.value! }
                });
                break;
            case "issueState":
                await requestThrow(updateIssueStateMutation, { input: { id, name, description } });
                break;
            case "assignmentType":
                await requestThrow(updateAssignmentTypeMutation, { input: { id, name, description } });
                break;
            case "issueRelationType":
                await requestThrow(updateIssueRelationTypeMutation, {
                    input: { id, name, description, inverseName: state.inverseName! }
                });
                break;
        }
    }, `Error updating ${attributeNames[attribute.kind]}`);
    updateAttributeDialog.value = false;
    emit("updated-attribute");
});

function cancel() {
    updateAttributeDialog.value = false;
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";

.update-template-attribute-dialog {
    width: min(700px, calc(100vw - 3 * settings.$side-bar-width));
}

.wrap-input {
    min-width: 250px;
}
</style>
