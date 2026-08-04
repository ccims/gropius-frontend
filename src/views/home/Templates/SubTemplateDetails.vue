<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="subTemplate != undefined">
        <TemplateGeneralDetails
            :name="subTemplate.name"
            :description="subTemplate.description"
            :hint="info.hint"
            :readonly="!canCreateTemplates"
            @save="save"
        />
        <DetailCompartment name="Template Field Specifications" class="mt-4">
            <TemplateFieldSpecificationList :field-specifications="subTemplate.templateFieldSpecifications" />
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import TemplateFieldSpecificationList from "@/components/TemplateFieldSpecificationList.vue";
import TemplateGeneralDetails from "@/components/TemplateGeneralDetails.vue";
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import type {
    UpdateComponentVersionTemplateInput,
    UpdateInterfacePartTemplateInput,
    UpdateInterfaceSpecificationVersionTemplateInput
} from "@/gql/graphql";
import { useAppStore } from "@/store/app";
import { useTemplateId } from "@/util/templates";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed, ref, type PropType } from "vue";

/** The sub templates that are part of a template */
export type SubTemplateKind = "componentVersion" | "interfaceSpecificationVersion" | "interfacePart";

const getComponentVersionTemplateQuery = graphql(`
    query getComponentVersionTemplate($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on ComponentTemplate {
                componentVersionTemplate {
                    ...SubTemplateDetailsInfo
                }
            }
        }
    }
`);

const getInterfaceSpecificationVersionTemplateQuery = graphql(`
    query getInterfaceSpecificationVersionTemplate($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on InterfaceSpecificationTemplate {
                interfaceSpecificationVersionTemplate {
                    ...SubTemplateDetailsInfo
                }
            }
        }
    }
`);

const getInterfacePartTemplateQuery = graphql(`
    query getInterfacePartTemplate($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on InterfaceSpecificationTemplate {
                interfacePartTemplate {
                    ...SubTemplateDetailsInfo
                }
            }
        }
    }
`);

const updateComponentVersionTemplateMutation = graphql(`
    mutation updateComponentVersionTemplate($input: UpdateComponentVersionTemplateInput!) {
        updateComponentVersionTemplate(input: $input) {
            componentVersionTemplate {
                id
            }
        }
    }
`);

const updateInterfaceSpecificationVersionTemplateMutation = graphql(`
    mutation updateInterfaceSpecificationVersionTemplate($input: UpdateInterfaceSpecificationVersionTemplateInput!) {
        updateInterfaceSpecificationVersionTemplate(input: $input) {
            interfaceSpecificationVersionTemplate {
                id
            }
        }
    }
`);

const updateInterfacePartTemplateMutation = graphql(`
    mutation updateInterfacePartTemplate($input: UpdateInterfacePartTemplateInput!) {
        updateInterfacePartTemplate(input: $input) {
            interfacePartTemplate {
                id
            }
        }
    }
`);

const subTemplateInfos: Record<SubTemplateKind, { name: string; hint: string }> = {
    componentVersion: {
        name: "component version",
        hint: "Applies to all versions of components with this template."
    },
    interfaceSpecificationVersion: {
        name: "interface specification version",
        hint: "Applies to all versions of interface specifications with this template."
    },
    interfacePart: {
        name: "interface part",
        hint: "Applies to all parts of interface specifications with this template."
    }
};

const props = defineProps({
    subTemplate: {
        type: String as PropType<SubTemplateKind>,
        required: true
    }
});

const store = useAppStore();
const templateId = useTemplateId();

const info = computed(() => subTemplateInfos[props.subTemplate]);
const canCreateTemplates = computed(() => store.user?.canCreateTemplates ?? false);
const reloadDependency = ref(0);

const subTemplate = computedAsync(
    async () => {
        if (!templateId.value) {
            return null;
        }
        reloadDependency.value;
        return await withErrorMessage(async () => {
            const id = templateId.value;
            switch (props.subTemplate) {
                case "componentVersion":
                    return (await queryNodeThrow(getComponentVersionTemplateQuery, "ComponentTemplate", { id }))
                        .componentVersionTemplate;
                case "interfaceSpecificationVersion":
                    return (
                        await queryNodeThrow(
                            getInterfaceSpecificationVersionTemplateQuery,
                            "InterfaceSpecificationTemplate",
                            { id }
                        )
                    ).interfaceSpecificationVersionTemplate;
                case "interfacePart":
                    return (
                        await queryNodeThrow(getInterfacePartTemplateQuery, "InterfaceSpecificationTemplate", { id })
                    ).interfacePartTemplate;
            }
        }, `Error loading ${info.value.name} template`);
    },
    null,
    { shallow: false }
);

async function save(input: { name?: string; description?: string }) {
    const id = subTemplate.value!.id;
    await withErrorMessage(async () => {
        // the type annotations are what reject fields an input does not have, requestThrow does not check its variables
        switch (props.subTemplate) {
            case "componentVersion": {
                const updateInput: UpdateComponentVersionTemplateInput = { id, ...input };
                await requestThrow(updateComponentVersionTemplateMutation, { input: updateInput });
                break;
            }
            case "interfaceSpecificationVersion": {
                const updateInput: UpdateInterfaceSpecificationVersionTemplateInput = { id, ...input };
                await requestThrow(updateInterfaceSpecificationVersionTemplateMutation, { input: updateInput });
                break;
            }
            case "interfacePart": {
                const updateInput: UpdateInterfacePartTemplateInput = { id, ...input };
                await requestThrow(updateInterfacePartTemplateMutation, { input: updateInput });
                break;
            }
        }
    }, `Error updating ${info.value.name} template`);
    reloadDependency.value++;
}
</script>
