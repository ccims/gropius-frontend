<template>
    <div class="pa-4 h-100 overflow-y-auto">
        <DetailCompartment name="Danger Zone" color="error-container">
            <div class="text-medium-emphasis mb-4">
                {{
                    isDeprecated
                        ? "This template is deprecated and cannot be selected for new issues."
                        : "Templates cannot be deleted, only deprecated."
                }}
            </div>
            <DefaultButton color="error" :disabled="isDeprecated == undefined || !canCreateTemplates">
                {{ isDeprecated ? "Restore template" : "Deprecate template" }}
                <ConfirmationDialog
                    :title="isDeprecated ? 'Restore template' : 'Deprecate template'"
                    :message="
                        isDeprecated
                            ? 'Are you sure you want to restore this template? It can be selected for new issues again.'
                            : 'Are you sure you want to deprecate this template? It can no longer be selected for new issues. Issues already using it are not affected.'
                    "
                    :confirm-text="isDeprecated ? 'Restore template' : 'Deprecate template'"
                    @confirm="updateDeprecationStatus"
                />
            </DefaultButton>
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { useAppStore } from "@/store/app";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const getIssueTemplateDeprecationStatusQuery = graphql(`
    query getIssueTemplateDeprecationStatus($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IssueTemplate {
                isDeprecated
            }
        }
    }
`);

const updateIssueTemplateDeprecationStatusMutation = graphql(`
    mutation updateIssueTemplateDeprecationStatus($id: ID!, $isDeprecated: Boolean!) {
        updateTemplateDeprecationStatus(input: { id: $id, isDeprecated: $isDeprecated }) {
            template {
                id
                isDeprecated
            }
        }
    }
`);

const route = useRoute();
const store = useAppStore();

const issueTemplateId = computed(() => route.params.issueTemplate as string);
const canCreateTemplates = computed(() => store.user?.canCreateTemplates ?? false);

const isDeprecated = ref<boolean>();

watch(
    issueTemplateId,
    async (id) => {
        isDeprecated.value = undefined;
        if (!id) {
            return;
        }
        const template = await withErrorMessage(
            () => queryNodeThrow(getIssueTemplateDeprecationStatusQuery, "IssueTemplate", { id }),
            "Error loading issue template"
        );
        isDeprecated.value = template.isDeprecated;
    },
    { immediate: true }
);

async function updateDeprecationStatus() {
    const res = await withErrorMessage(
        () =>
            requestThrow(updateIssueTemplateDeprecationStatusMutation, {
                id: issueTemplateId.value,
                isDeprecated: !isDeprecated.value
            }),
        "Error updating deprecation status"
    );
    isDeprecated.value = res.updateTemplateDeprecationStatus.template.isDeprecated;
}
</script>
