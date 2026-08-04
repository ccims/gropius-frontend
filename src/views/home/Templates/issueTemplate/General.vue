<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="issueTemplate != undefined">
        <DetailCompartment name="General">
            <InputWrapper
                v-model="issueTemplate.name"
                v-slot="{ modelValue }"
                @save="save({ name: $event })"
                :readonly="!canCreateTemplates"
            >
                <v-text-field v-model="modelValue.value" label="Name" :readonly="!canCreateTemplates" />
            </InputWrapper>
            <InputWrapper
                v-model="issueTemplate.description"
                v-slot="{ modelValue }"
                @save="save({ description: $event })"
                :readonly="!canCreateTemplates"
            >
                <v-textarea v-model="modelValue.value" label="Description" :readonly="!canCreateTemplates" />
            </InputWrapper>
            <div class="field-group">
                <div class="field-label text-medium-emphasis">Status</div>
                <div class="field-value">{{ issueTemplate.isDeprecated ? "Deprecated" : "Active" }}</div>
            </div>
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import InputWrapper from "@/components/input/InputWrapper.vue";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import type { UpdateIssueTemplateInput } from "@/gql/graphql";
import { useAppStore } from "@/store/app";
import { eventBusKey } from "@/util/keys";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed, inject } from "vue";
import { useRoute } from "vue-router";

const getIssueTemplateGeneralDetailsQuery = graphql(`
    query getIssueTemplateGeneralDetails($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IssueTemplate {
                name
                description
                isDeprecated
            }
        }
    }
`);

const updateIssueTemplateMutation = graphql(`
    mutation updateIssueTemplate($input: UpdateIssueTemplateInput!) {
        updateIssueTemplate(input: $input) {
            issueTemplate {
                id
            }
        }
    }
`);

const route = useRoute();
const store = useAppStore();
const eventBus = inject(eventBusKey);

const issueTemplateId = computed(() => route.params.issueTemplate as string);
const canCreateTemplates = computed(() => store.user?.canCreateTemplates ?? false);

const issueTemplate = computedAsync(
    async () => {
        if (!issueTemplateId.value) {
            return null;
        }
        return await withErrorMessage(
            () => queryNodeThrow(getIssueTemplateGeneralDetailsQuery, "IssueTemplate", { id: issueTemplateId.value }),
            "Error loading issue template details"
        );
    },
    null,
    { shallow: false }
);

async function save(input: Omit<UpdateIssueTemplateInput, "id">) {
    await withErrorMessage(
        () =>
            requestThrow(updateIssueTemplateMutation, {
                input: {
                    id: issueTemplateId.value,
                    ...input
                }
            }),
        "Error updating issue template details"
    );
    if ("name" in input) {
        eventBus?.emit("title-segment-changed");
    }
}
</script>

<style scoped lang="scss">
.field-group {
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
}

.field-label {
    font-size: 12px;
    margin-bottom: 4px;
}

.field-value {
    font-size: 16px;
}
</style>
