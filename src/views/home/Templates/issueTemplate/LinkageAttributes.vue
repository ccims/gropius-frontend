<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="issueTemplate != undefined">
        <DetailCompartment name="Assignment Types">
            <div v-if="issueTemplate.assignmentTypes.nodes.length === 0" class="text-medium-emphasis">
                No assignment types defined
            </div>
            <CustomList v-else :items="issueTemplate.assignmentTypes.nodes" :to="() => undefined">
                <template #item="{ item }">
                    <ListItem
                        :title="item.name"
                        :subtitle="item.description || 'No description provided'"
                        :italic-subtitle="!item.description"
                    >
                        <template #append>
                            <IconButton v-if="canCreateTemplates" @click="edit('assignmentType', item)">
                                <v-icon icon="mdi-pencil" />
                                <v-tooltip activator="parent" location="bottom">Edit assignment type</v-tooltip>
                            </IconButton>
                        </template>
                    </ListItem>
                </template>
            </CustomList>
        </DetailCompartment>

        <DetailCompartment name="Relation Types" class="mt-4">
            <div v-if="issueTemplate.relationTypes.nodes.length === 0" class="text-medium-emphasis">
                No relation types defined
            </div>
            <CustomList v-else :items="issueTemplate.relationTypes.nodes" :to="() => undefined">
                <template #item="{ item }">
                    <ListItem
                        :title="item.name"
                        :subtitle="item.description || 'No description provided'"
                        :italic-subtitle="!item.description"
                    >
                        <template #title-append>
                            <v-icon icon="mdi-arrow-right" size="small" class="mx-2 flex-shrink-0" />
                            <span class="text-medium-emphasis text-ellipsis">{{ item.inverseName }}</span>
                        </template>
                        <template #append>
                            <IconButton v-if="canCreateTemplates" @click="edit('issueRelationType', item)">
                                <v-icon icon="mdi-pencil" />
                                <v-tooltip activator="parent" location="bottom">Edit relation type</v-tooltip>
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
import UpdateTemplateAttributeDialog, {
    type TemplateAttribute,
    type TemplateAttributeKind
} from "@/components/dialog/UpdateTemplateAttributeDialog.vue";
import { queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { useAppStore } from "@/store/app";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { useTemplateId } from "@/util/templates";
import { computed, ref } from "vue";

const getIssueTemplateLinkageAttributesQuery = graphql(`
    query getIssueTemplateLinkageAttributes($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IssueTemplate {
                assignmentTypes {
                    nodes {
                        id
                        name
                        description
                        partOf {
                            totalCount
                        }
                    }
                }
                relationTypes {
                    nodes {
                        id
                        name
                        description
                        inverseName
                        partOf {
                            totalCount
                        }
                    }
                }
            }
        }
    }
`);

const store = useAppStore();
const issueTemplateId = useTemplateId();

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
            () =>
                queryNodeThrow(getIssueTemplateLinkageAttributesQuery, "IssueTemplate", { id: issueTemplateId.value }),
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
        inverseName?: string;
    }
) {
    editedAttribute.value = {
        kind,
        id: attribute.id,
        name: attribute.name,
        description: attribute.description,
        templateCount: attribute.partOf.totalCount,
        inverseName: attribute.inverseName
    };
}
</script>
