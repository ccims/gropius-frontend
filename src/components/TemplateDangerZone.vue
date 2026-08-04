<template>
    <DetailCompartment name="Danger Zone" color="error-container">
        <div class="text-medium-emphasis mb-4">
            {{
                isDeprecated
                    ? `This template is deprecated and cannot be selected for new ${entityName}.`
                    : "Templates cannot be deleted, only deprecated."
            }}
        </div>
        <DefaultButton color="error" :disabled="isDeprecated == undefined || !canCreateTemplates">
            {{ isDeprecated ? "Restore template" : "Deprecate template" }}
            <ConfirmationDialog
                :title="isDeprecated ? 'Restore template' : 'Deprecate template'"
                :message="
                    isDeprecated
                        ? `Are you sure you want to restore this template? It can be selected for new ${entityName} again.`
                        : `Are you sure you want to deprecate this template? It can no longer be selected for new ${entityName}. Existing ${entityName} are not affected.`
                "
                :confirm-text="isDeprecated ? 'Restore template' : 'Deprecate template'"
                @confirm="updateDeprecationStatus"
            />
        </DefaultButton>
    </DetailCompartment>
</template>

<script lang="ts" setup>
import DetailCompartment from "./DetailCompartment.vue";
import ConfirmationDialog from "./dialog/ConfirmationDialog.vue";
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { useAppStore } from "@/store/app";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computed, ref, toRef, watch } from "vue";

const getTemplateDeprecationStatusQuery = graphql(`
    query getTemplateDeprecationStatus($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on Template {
                isDeprecated
            }
        }
    }
`);

const updateTemplateDeprecationStatusMutation = graphql(`
    mutation updateTemplateDeprecationStatus($id: ID!, $isDeprecated: Boolean!) {
        updateTemplateDeprecationStatus(input: { id: $id, isDeprecated: $isDeprecated }) {
            template {
                id
                isDeprecated
            }
        }
    }
`);

const props = defineProps({
    templateId: {
        type: String,
        required: true
    },
    /** Plural name of the entities the template is used for, e.g. "issues" */
    entityName: {
        type: String,
        required: true
    }
});

const store = useAppStore();
const canCreateTemplates = computed(() => store.user?.canCreateTemplates ?? false);

const isDeprecated = ref<boolean>();

watch(
    toRef(props, "templateId"),
    async (id) => {
        isDeprecated.value = undefined;
        if (!id) {
            return;
        }
        const res = await withErrorMessage(
            () => requestThrow(getTemplateDeprecationStatusQuery, { id }),
            "Error loading template"
        );
        // the node query can return any node, only templates carry a deprecation status
        isDeprecated.value = res.node != undefined && "isDeprecated" in res.node ? res.node.isDeprecated : undefined;
    },
    { immediate: true }
);

async function updateDeprecationStatus() {
    const res = await withErrorMessage(
        () =>
            requestThrow(updateTemplateDeprecationStatusMutation, {
                id: props.templateId,
                isDeprecated: !isDeprecated.value
            }),
        "Error updating deprecation status"
    );
    isDeprecated.value = res.updateTemplateDeprecationStatus.template.isDeprecated;
}
</script>
