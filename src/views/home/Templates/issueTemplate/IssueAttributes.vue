<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="issueTemplate != undefined">
        <DetailCompartment name="Issue Types">
            <div v-if="issueTemplate.issueTypes.nodes.length === 0" class="text-medium-emphasis">
                No issue types defined
            </div>
            <CustomList v-else :items="issueTemplate.issueTypes.nodes" :to="() => undefined">
                <template #item="{ item }">
                    <ListItem
                        :title="item.name"
                        :subtitle="item.description || 'No description provided'"
                        :italic-subtitle="!item.description"
                    >
                        <template #prepend>
                            <SvgWrapper :path="item.iconPath" class="mr-3 flex-0-0 attribute-icon" />
                        </template>
                        <template #append>
                            <IconButton v-if="canCreateTemplates" @click="edit('issueType', item)">
                                <v-icon icon="mdi-pencil" />
                                <v-tooltip activator="parent" location="bottom">Edit issue type</v-tooltip>
                            </IconButton>
                        </template>
                    </ListItem>
                </template>
            </CustomList>
        </DetailCompartment>

        <DetailCompartment name="Issue Priorities" class="mt-4">
            <div v-if="issueTemplate.issuePriorities.nodes.length === 0" class="text-medium-emphasis">
                No issue priorities defined
            </div>
            <CustomList v-else :items="issueTemplate.issuePriorities.nodes" :to="() => undefined">
                <template #item="{ item }">
                    <ListItem
                        :title="item.name"
                        :subtitle="item.description || 'No description provided'"
                        :italic-subtitle="!item.description"
                    >
                        <template #prepend>
                            <SvgWrapper :path="item.iconPath" class="mr-3 flex-0-0 attribute-icon" />
                        </template>
                        <template #title-append>
                            <v-chip color="primary" size="small" class="ml-2 flex-shrink-0">
                                Value: {{ item.value }}
                            </v-chip>
                        </template>
                        <template #append>
                            <IconButton v-if="canCreateTemplates" @click="edit('issuePriority', item)">
                                <v-icon icon="mdi-pencil" />
                                <v-tooltip activator="parent" location="bottom">Edit issue priority</v-tooltip>
                            </IconButton>
                        </template>
                    </ListItem>
                </template>
            </CustomList>
        </DetailCompartment>

        <DetailCompartment name="Issue States" class="mt-4">
            <div v-if="issueTemplate.issueStates.nodes.length === 0" class="text-medium-emphasis">
                No issue states defined
            </div>
            <CustomList v-else :items="issueTemplate.issueStates.nodes" :to="() => undefined">
                <template #item="{ item }">
                    <ListItem
                        :title="item.name"
                        :subtitle="item.description || 'No description provided'"
                        :italic-subtitle="!item.description"
                    >
                        <template #title-append>
                            <v-chip
                                :color="item.isOpen ? 'issue-open' : 'issue-closed'"
                                size="small"
                                class="ml-2 flex-shrink-0"
                            >
                                {{ item.isOpen ? "Open" : "Closed" }}
                            </v-chip>
                        </template>
                        <template #append>
                            <IconButton v-if="canCreateTemplates" @click="edit('issueState', item)">
                                <v-icon icon="mdi-pencil" />
                                <v-tooltip activator="parent" location="bottom">Edit issue state</v-tooltip>
                            </IconButton>
                        </template>
                    </ListItem>
                </template>
            </CustomList>
        </DetailCompartment>

        <UpdateTemplateAttributeDialog v-model="editedAttribute" @updated-attribute="reloadDependency++" />
    </div>
</template>

<script lang="ts" setup>
import CustomList from "@/components/CustomList.vue";
import DetailCompartment from "@/components/DetailCompartment.vue";
import ListItem from "@/components/ListItem.vue";
import SvgWrapper from "@/components/SvgWrapper.vue";
import UpdateTemplateAttributeDialog, {
    type TemplateAttribute,
    type TemplateAttributeKind
} from "@/components/dialog/UpdateTemplateAttributeDialog.vue";
import { queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { useAppStore } from "@/store/app";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const getIssueTemplateIssueAttributesQuery = graphql(`
    query getIssueTemplateIssueAttributes($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IssueTemplate {
                issueTypes {
                    nodes {
                        id
                        name
                        description
                        iconPath
                        partOf {
                            totalCount
                        }
                    }
                }
                issuePriorities {
                    nodes {
                        id
                        name
                        description
                        value
                        iconPath
                        partOf {
                            totalCount
                        }
                    }
                }
                issueStates {
                    nodes {
                        id
                        name
                        description
                        isOpen
                        partOf {
                            totalCount
                        }
                    }
                }
            }
        }
    }
`);

const route = useRoute();
const store = useAppStore();

const issueTemplateId = computed(() => route.params.issueTemplate as string);
const canCreateTemplates = computed(() => store.user?.canCreateTemplates ?? false);

const editedAttribute = ref<TemplateAttribute | null>(null);
const reloadDependency = ref(0);

const issueTemplate = computedAsync(
    async () => {
        if (!issueTemplateId.value) {
            return null;
        }
        reloadDependency.value;
        return await withErrorMessage(
            () => queryNodeThrow(getIssueTemplateIssueAttributesQuery, "IssueTemplate", { id: issueTemplateId.value }),
            "Error loading issue template details"
        );
    },
    null,
    { shallow: false }
);

function edit(
    kind: TemplateAttributeKind,
    attribute: {
        id: string;
        name: string;
        description: string;
        partOf: { totalCount: number };
        iconPath?: string;
        value?: number;
    }
) {
    editedAttribute.value = {
        kind,
        id: attribute.id,
        name: attribute.name,
        description: attribute.description,
        templateCount: attribute.partOf.totalCount,
        iconPath: attribute.iconPath,
        value: attribute.value
    };
}
</script>

<style scoped lang="scss">
.attribute-icon {
    color: rgb(var(--v-theme-primary));
}
</style>
