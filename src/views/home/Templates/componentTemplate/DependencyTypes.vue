<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="componentTemplate != undefined">
        <DetailCompartment name="Dependency Types">
            <div class="text-medium-emphasis mb-4">
                Types the dependencies between the interfaces of a component with this template can have, like CALLS.
            </div>
            <div
                v-if="componentTemplate.intraComponentDependencySpecificationTypes.nodes.length == 0"
                class="text-medium-emphasis"
            >
                No dependency types defined
            </div>
            <CustomList
                v-else
                :items="componentTemplate.intraComponentDependencySpecificationTypes.nodes"
                :to="() => undefined"
            >
                <template #item="{ item }">
                    <ListItem
                        :title="item.name"
                        :subtitle="item.description || 'No description provided'"
                        :italic-subtitle="!item.description"
                    >
                        <template #append>
                            <IconButton v-if="canCreateTemplates" @click="edit(item)">
                                <v-icon icon="mdi-pencil" />
                                <v-tooltip activator="parent" location="bottom">Edit dependency type</v-tooltip>
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
    type TemplateAttribute
} from "@/components/dialog/UpdateTemplateAttributeDialog.vue";
import { graphql } from "@/gql";
import { queryNodeThrow } from "@/gql/client";
import { useAppStore } from "@/store/app";
import { useTemplateId } from "@/util/templates";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed, ref } from "vue";

const getComponentTemplateDependencyTypesQuery = graphql(`
    query getComponentTemplateDependencyTypes($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on ComponentTemplate {
                intraComponentDependencySpecificationTypes {
                    nodes {
                        id
                        name
                        description
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
const templateId = useTemplateId();

const canCreateTemplates = computed(() => store.user?.canCreateTemplates ?? false);

const editedAttribute = ref<TemplateAttribute | null>(null);
const reloadDependency = ref(0);

const componentTemplate = computedAsync(
    async () => {
        if (!templateId.value) {
            return null;
        }
        reloadDependency.value;
        return await withErrorMessage(
            () =>
                queryNodeThrow(getComponentTemplateDependencyTypesQuery, "ComponentTemplate", { id: templateId.value }),
            "Error loading component template details"
        );
    },
    null,
    { shallow: false }
);

function edit(dependencyType: { id: string; name: string; description: string; partOf: { totalCount: number } }) {
    editedAttribute.value = {
        kind: "intraComponentDependencySpecificationType",
        id: dependencyType.id,
        name: dependencyType.name,
        description: dependencyType.description,
        templateCount: dependencyType.partOf.totalCount
    };
}
</script>
