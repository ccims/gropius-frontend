<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="template != undefined">
        <DetailCompartment name="Template Field Specifications">
            <TemplateFieldSpecificationList :field-specifications="template.templateFieldSpecifications" />
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import TemplateFieldSpecificationList from "@/components/TemplateFieldSpecificationList.vue";
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { templateKindInfos, useTemplateId, type TemplateKind } from "@/util/templates";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import type { PropType } from "vue";

const getTemplateFieldSpecificationsQuery = graphql(`
    query getTemplateFieldSpecifications($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on BaseTemplate {
                templateFieldSpecifications {
                    name
                    value
                }
            }
        }
    }
`);

const props = defineProps({
    kind: {
        type: String as PropType<TemplateKind>,
        required: true
    }
});

const templateId = useTemplateId();

const template = computedAsync(
    async () => {
        if (!templateId.value) {
            return null;
        }
        const res = await withErrorMessage(
            () => requestThrow(getTemplateFieldSpecificationsQuery, { id: templateId.value }),
            `Error loading ${templateKindInfos[props.kind].name} template details`
        );
        // the node query can return any node, only templates have field specifications
        return res.node != undefined && "templateFieldSpecifications" in res.node ? res.node : null;
    },
    null,
    { shallow: false }
);
</script>
