<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="issueTemplate != undefined">
        <DetailCompartment name="General">
            <div class="field-group">
                <div class="field-label text-medium-emphasis">Name</div>
                <div class="field-value">{{ issueTemplate.name }}</div>
            </div>
            <div class="field-group">
                <div class="field-label text-medium-emphasis">Description</div>
                <div class="field-value">{{ issueTemplate.description || "No description provided" }}</div>
            </div>
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import { NodeReturnType, useClient } from "@/graphql/client";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { useRoute } from "vue-router";

type IssueTemplate = NodeReturnType<"getIssueTemplateFields", "IssueTemplate">;

const client = useClient();
const route = useRoute();
const issueTemplateId = computed(() => route.params.issueTemplate as string);

const issueTemplate = computedAsync(
    async () => {
        if (!issueTemplateId.value) {
            return null;
        }
        const res = await withErrorMessage(
            () => client.getIssueTemplateFields({ id: issueTemplateId.value }),
            "Error loading issue template details"
        );
        return res.node as IssueTemplate;
    },
    null,
    { shallow: false }
);
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
