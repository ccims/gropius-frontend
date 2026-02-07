<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="issueTemplate != undefined">
        <DetailCompartment name="Template Field Specifications">
            <div v-if="issueTemplate.templateFieldSpecifications.length === 0" class="text-medium-emphasis">
                No template field specifications defined
            </div>
            <div v-else class="attribute-list">
                <div v-for="field in issueTemplate.templateFieldSpecifications" :key="field.name" class="attribute-item">
                    <div class="attribute-header">
                        <span class="attribute-name">{{ field.name }}</span>
                    </div>
                    <div class="field-value-container">
                        <pre class="field-value">{{ formatValue(field.value) }}</pre>
                    </div>
                </div>
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

function formatValue(value: any): string {
    if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
}
</script>

<style scoped lang="scss">
.attribute-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.attribute-item {
    padding: 8px 12px;
    background: rgba(var(--v-theme-surface-variant), 0.3);
    border-radius: 8px;
}

.attribute-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.attribute-name {
    font-weight: 500;
}

.field-value-container {
    background: rgba(var(--v-theme-surface), 0.5);
    border-radius: 4px;
    padding: 8px;
    overflow-x: auto;
}

.field-value {
    margin: 0;
    font-family: monospace;
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
