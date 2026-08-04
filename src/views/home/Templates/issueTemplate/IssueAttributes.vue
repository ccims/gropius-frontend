<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="issueTemplate != undefined">
        <DetailCompartment name="Issue Types">
            <div v-if="issueTemplate.issueTypes.nodes.length === 0" class="text-medium-emphasis">
                No issue types defined
            </div>
            <div v-else class="attribute-list">
                <div v-for="issueType in issueTemplate.issueTypes.nodes" :key="issueType.name" class="attribute-item">
                    <div class="attribute-header">
                        <SvgWrapper :path="issueType.iconPath" class="mr-2" />
                        <span class="attribute-name">{{ issueType.name }}</span>
                    </div>
                    <div v-if="issueType.description" class="attribute-description text-medium-emphasis">
                        {{ issueType.description }}
                    </div>
                </div>
            </div>
        </DetailCompartment>

        <DetailCompartment name="Issue Priorities" class="mt-4">
            <div v-if="issueTemplate.issuePriorities.nodes.length === 0" class="text-medium-emphasis">
                No issue priorities defined
            </div>
            <div v-else class="attribute-list">
                <div
                    v-for="priority in issueTemplate.issuePriorities.nodes"
                    :key="priority.name"
                    class="attribute-item"
                >
                    <div class="attribute-header">
                        <SvgWrapper :path="priority.iconPath" class="mr-2" />
                        <span class="attribute-name">{{ priority.name }}</span>
                        <v-chip size="x-small" class="ml-2" variant="outlined">Value: {{ priority.value }}</v-chip>
                    </div>
                    <div v-if="priority.description" class="attribute-description text-medium-emphasis">
                        {{ priority.description }}
                    </div>
                </div>
            </div>
        </DetailCompartment>

        <DetailCompartment name="Issue States" class="mt-4">
            <div v-if="issueTemplate.issueStates.nodes.length === 0" class="text-medium-emphasis">
                No issue states defined
            </div>
            <div v-else class="attribute-list">
                <div v-for="state in issueTemplate.issueStates.nodes" :key="state.name" class="attribute-item">
                    <div class="attribute-header">
                        <span class="attribute-name">{{ state.name }}</span>
                        <v-chip size="x-small" class="ml-2" :color="state.isOpen ? 'success' : 'error'" variant="tonal">
                            {{ state.isOpen ? "Open" : "Closed" }}
                        </v-chip>
                    </div>
                    <div v-if="state.description" class="attribute-description text-medium-emphasis">
                        {{ state.description }}
                    </div>
                </div>
            </div>
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import SvgWrapper from "@/components/SvgWrapper.vue";
import { queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { useRoute } from "vue-router";

const getIssueTemplateIssueAttributesQuery = graphql(`
    query getIssueTemplateIssueAttributes($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IssueTemplate {
                issueTypes {
                    nodes {
                        name
                        description
                        iconPath
                    }
                }
                issuePriorities {
                    nodes {
                        name
                        description
                        value
                        iconPath
                    }
                }
                issueStates {
                    nodes {
                        name
                        description
                        isOpen
                    }
                }
            }
        }
    }
`);

const route = useRoute();
const issueTemplateId = computed(() => route.params.issueTemplate as string);

const issueTemplate = computedAsync(
    async () => {
        if (!issueTemplateId.value) {
            return null;
        }
        return await withErrorMessage(
            () => queryNodeThrow(getIssueTemplateIssueAttributesQuery, "IssueTemplate", { id: issueTemplateId.value }),
            "Error loading issue template details"
        );
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
    margin-left: 28px;
}
</style>
