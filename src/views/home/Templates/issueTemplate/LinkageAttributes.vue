<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="issueTemplate != undefined">
        <DetailCompartment name="Assignment Types">
            <div v-if="issueTemplate.assignmentTypes.nodes.length === 0" class="text-medium-emphasis">
                No assignment types defined
            </div>
            <div v-else class="attribute-list">
                <div
                    v-for="assignmentType in issueTemplate.assignmentTypes.nodes"
                    :key="assignmentType.name"
                    class="attribute-item"
                >
                    <div class="attribute-header">
                        <span class="attribute-name">{{ assignmentType.name }}</span>
                    </div>
                    <div v-if="assignmentType.description" class="attribute-description text-medium-emphasis">
                        {{ assignmentType.description }}
                    </div>
                </div>
            </div>
        </DetailCompartment>

        <DetailCompartment name="Relation Types" class="mt-4">
            <div v-if="issueTemplate.relationTypes.nodes.length === 0" class="text-medium-emphasis">
                No relation types defined
            </div>
            <div v-else class="attribute-list">
                <div
                    v-for="relationType in issueTemplate.relationTypes.nodes"
                    :key="relationType.name"
                    class="attribute-item"
                >
                    <div class="attribute-header">
                        <span class="attribute-name">{{ relationType.name }}</span>
                        <v-icon icon="mdi-arrow-right" size="small" class="mx-2" />
                        <span class="attribute-name text-medium-emphasis">{{ relationType.inverseName }}</span>
                    </div>
                    <div v-if="relationType.description" class="attribute-description text-medium-emphasis">
                        {{ relationType.description }}
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
}

.attribute-name {
    font-weight: 500;
}

.attribute-description {
    font-size: 14px;
    margin-top: 4px;
}
</style>
