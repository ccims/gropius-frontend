<template>
    <BaseLayout>
        <template #content>
            <Markdown
                :model-value="legalInformation?.text ?? 'Loading...'"
                :edit-mode="false"
                :editable="false"
                class="pa-8 h-100 overflow-y-auto"
            />
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import Markdown from "@/components/Markdown.vue";
import { queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { withErrorMessage } from "@/util/withErrorMessage";

const route = useRoute();

const legalInformationId = computed(() => route.params.legalInformation as string);

const getLegalInformationQuery = graphql(`
    query getLegalInformation($id: ID!) {
        node(id: $id) {
            __typename
            ... on LegalInformation {
                ...DefaultLegalInformationInfo
            }
        }
    }
`);

const legalInformation = computedAsync(async () => {
    return await withErrorMessage(async () => {
        return await queryNodeThrow(getLegalInformationQuery, "LegalInformation", { id: legalInformationId.value });
    }, "Error loading legal information");
});
</script>
