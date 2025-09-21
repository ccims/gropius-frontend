<template>
    <BaseLayout>
        <template #content>
            <Markdown
                :model-value="legalInformation?.text ?? 'Loading...'"
                :edit-mode="false"
                :editable="false"
                class="pa-8"
            />
        </template>
    </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import Markdown from "@/components/Markdown.vue";
import { NodeReturnType, useClient } from "@/graphql/client";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const client = useClient();

const legalInformationId = computed(() => route.params.legalInformation as string);

const legalInformation = computedAsync(async () => {
    return await withErrorMessage(async () => {
        const res = await client.getLegalInformation({ id: legalInformationId.value });
        console.log(res);
        return res.node as NodeReturnType<"getLegalInformation", "LegalInformation">;
    }, "Error fetching legal information");
});
</script>
