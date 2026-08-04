<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="componentTemplate != undefined">
        <DetailCompartment name="Visible Interface Specifications">
            <div class="text-medium-emphasis mb-4">
                Interface specifications with these templates can be visible on components with this template. This is
                defined when the interface specification template is created.
            </div>
            <TemplateReferenceList
                :templates="componentTemplate.possibleVisibleInterfaceSpecifications.nodes"
                kind="interface-specification"
                empty-message="No interface specification templates can be visible"
            />
        </DetailCompartment>

        <DetailCompartment name="Invisible Interface Specifications" class="mt-4">
            <div class="text-medium-emphasis mb-4">
                Interface specifications with these templates can be invisible on components with this template. This is
                defined when the interface specification template is created.
            </div>
            <TemplateReferenceList
                :templates="componentTemplate.possibleInvisibleInterfaceSpecifications.nodes"
                kind="interface-specification"
                empty-message="No interface specification templates can be invisible"
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

const getComponentTemplateInterfaceSpecificationsQuery = graphql(`
    query getComponentTemplateInterfaceSpecifications($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on ComponentTemplate {
                possibleVisibleInterfaceSpecifications {
                    nodes {
                        id
                        name
                        description
                    }
                }
                possibleInvisibleInterfaceSpecifications {
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

const componentTemplate = computedAsync(
    async () => {
        if (!templateId.value) {
            return null;
        }
        return await withErrorMessage(
            () =>
                queryNodeThrow(getComponentTemplateInterfaceSpecificationsQuery, "ComponentTemplate", {
                    id: templateId.value
                }),
            "Error loading component template details"
        );
    },
    null,
    { shallow: false }
);
</script>
