<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="interfaceSpecificationTemplate != undefined">
        <DetailCompartment name="Visible On Components">
            <div class="text-medium-emphasis mb-4">
                Interface specifications with this template can be visible on components with these templates.
            </div>
            <TemplateReferenceList
                :templates="interfaceSpecificationTemplate.canBeVisibleOnComponents.nodes"
                kind="component"
                empty-message="Cannot be visible on any component template"
            />
        </DetailCompartment>

        <DetailCompartment name="Invisible On Components" class="mt-4">
            <div class="text-medium-emphasis mb-4">
                Interface specifications with this template can be invisible on components with these templates.
            </div>
            <TemplateReferenceList
                :templates="interfaceSpecificationTemplate.canBeInvisibleOnComponents.nodes"
                kind="component"
                empty-message="Cannot be invisible on any component template"
            />
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import TemplateReferenceList from "@/components/TemplateReferenceList.vue";
import { graphql } from "@/gql";
import { queryNodeThrow } from "@/gql/client";
import { useTemplateId } from "@/util/templates";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";

const getInterfaceSpecificationTemplateComponentsQuery = graphql(`
    query getInterfaceSpecificationTemplateComponents($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on InterfaceSpecificationTemplate {
                canBeVisibleOnComponents {
                    nodes {
                        id
                        name
                        description
                    }
                }
                canBeInvisibleOnComponents {
                    nodes {
                        id
                        name
                        description
                    }
                }
            }
        }
    }
`);

const templateId = useTemplateId();

const interfaceSpecificationTemplate = computedAsync(
    async () => {
        if (!templateId.value) {
            return null;
        }
        return await withErrorMessage(
            () =>
                queryNodeThrow(getInterfaceSpecificationTemplateComponentsQuery, "InterfaceSpecificationTemplate", {
                    id: templateId.value
                }),
            "Error loading interface specification template details"
        );
    },
    null,
    { shallow: false }
);
</script>
