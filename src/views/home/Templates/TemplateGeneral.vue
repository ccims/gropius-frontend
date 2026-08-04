<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="template != undefined">
        <TemplateGeneralDetails
            :name="template.name"
            :description="template.description"
            :status="template.isDeprecated ? 'Deprecated' : 'Active'"
            :readonly="!canCreateTemplates"
            @save="save"
        />

        <DetailCompartment v-if="shape != undefined || marker != undefined" name="Appearance" class="mt-4">
            <InputWrapper
                v-if="shape != undefined"
                :model-value="shape.shapeType"
                v-slot="{ modelValue }"
                :readonly="!canCreateTemplates"
                @save="saveShapeType"
            >
                <v-select
                    v-model="modelValue.value"
                    :items="shapeTypeItems"
                    label="Shape"
                    :readonly="!canCreateTemplates"
                />
            </InputWrapper>
            <InputWrapper
                v-if="shape != undefined"
                :model-value="shape.shapeRadius"
                v-slot="{ modelValue }"
                :readonly="!canCreateTemplates"
                @save="saveShapeRadius"
            >
                <v-number-input
                    v-model="modelValue.value"
                    :precision="null"
                    :min="0"
                    label="Corner radius"
                    :readonly="!canCreateTemplates"
                />
            </InputWrapper>
            <InputWrapper
                v-if="marker != undefined"
                :model-value="marker.markerType"
                v-slot="{ modelValue }"
                :readonly="!canCreateTemplates"
                @save="saveMarkerType"
            >
                <v-select
                    v-model="modelValue.value"
                    :items="markerTypeItems"
                    label="Marker"
                    :readonly="!canCreateTemplates"
                />
            </InputWrapper>

            <InputWrapper
                v-if="shape != undefined"
                :model-value="shape.fill?.color ?? ''"
                v-slot="{ modelValue }"
                :readonly="!canCreateTemplates"
                @save="saveFill"
            >
                <ColorInput
                    v-model="modelValue.value"
                    label="Fill color"
                    :readonly="!canCreateTemplates"
                    hint="Empty means no fill"
                    persistent-hint
                />
            </InputWrapper>
            <InputWrapper
                :model-value="strokeState"
                v-slot="{ modelValue }"
                :readonly="!canCreateTemplates"
                @save="saveStroke"
            >
                <ColorInput
                    v-model="modelValue.value.color"
                    label="Stroke color"
                    :readonly="!canCreateTemplates"
                    hint="Empty means the default stroke color"
                    persistent-hint
                />
                <v-text-field
                    v-model="modelValue.value.dash"
                    label="Stroke dash"
                    class="mt-3"
                    :readonly="!canCreateTemplates"
                    hint="Dash pattern as comma separated lengths, e.g. 4, 4. Empty means a solid stroke"
                    persistent-hint
                    :error-messages="
                        modelValue.value.dash && parseStrokeDash(modelValue.value.dash) == undefined
                            ? 'Must be a comma separated list of numbers'
                            : ''
                    "
                />
            </InputWrapper>
        </DetailCompartment>
    </div>
</template>

<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import ColorInput from "@/components/input/ColorInput.vue";
import InputWrapper from "@/components/input/InputWrapper.vue";
import TemplateGeneralDetails from "@/components/TemplateGeneralDetails.vue";
import { graphql } from "@/gql";
import { MarkerType, ShapeType } from "@/gql/enums";
import { requestThrow } from "@/gql/client";
import type {
    FillStyleInput,
    StrokeStyleInput,
    UpdateArtefactTemplateInput,
    UpdateComponentTemplateInput,
    UpdateInterfaceSpecificationTemplateInput,
    UpdateIssueTemplateInput,
    UpdateRelationTemplateInput
} from "@/gql/graphql";
import { useAppStore } from "@/store/app";
import { eventBusKey } from "@/util/keys";
import { humanizeEnumValue, parseStrokeDash } from "@/util/templateInputs";
import { templateKindInfos, useTemplateId, type TemplateKind } from "@/util/templates";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed, inject, ref, type PropType } from "vue";

const getTemplateGeneralDetailsQuery = graphql(`
    query getTemplateGeneralDetails($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on Template {
                name
                description
                isDeprecated
            }
            ... on RelationPartnerTemplate {
                shapeType
                shapeRadius
                fill {
                    color
                }
                stroke {
                    color
                    dash
                }
            }
            ... on RelationTemplate {
                markerType
                stroke {
                    color
                    dash
                }
            }
        }
    }
`);

const updateIssueTemplateMutation = graphql(`
    mutation updateIssueTemplate($input: UpdateIssueTemplateInput!) {
        updateIssueTemplate(input: $input) {
            issueTemplate {
                id
            }
        }
    }
`);

const updateArtefactTemplateMutation = graphql(`
    mutation updateArtefactTemplate($input: UpdateArtefactTemplateInput!) {
        updateArtefactTemplate(input: $input) {
            artefactTemplate {
                id
            }
        }
    }
`);

const updateComponentTemplateMutation = graphql(`
    mutation updateComponentTemplate($input: UpdateComponentTemplateInput!) {
        updateComponentTemplate(input: $input) {
            componentTemplate {
                id
            }
        }
    }
`);

const updateInterfaceSpecificationTemplateMutation = graphql(`
    mutation updateInterfaceSpecificationTemplate($input: UpdateInterfaceSpecificationTemplateInput!) {
        updateInterfaceSpecificationTemplate(input: $input) {
            interfaceSpecificationTemplate {
                id
            }
        }
    }
`);

const updateRelationTemplateMutation = graphql(`
    mutation updateRelationTemplate($input: UpdateRelationTemplateInput!) {
        updateRelationTemplate(input: $input) {
            relationTemplate {
                id
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

const store = useAppStore();
const eventBus = inject(eventBusKey);
const templateId = useTemplateId();

const canCreateTemplates = computed(() => store.user?.canCreateTemplates ?? false);
const reloadDependency = ref(0);

const template = computedAsync(
    async () => {
        if (!templateId.value) {
            return null;
        }
        reloadDependency.value;
        const res = await withErrorMessage(
            () => requestThrow(getTemplateGeneralDetailsQuery, { id: templateId.value }),
            `Error loading ${templateKindInfos[props.kind].name} template details`
        );
        // the node query can return any node, only templates have these fields
        return res.node != undefined && "isDeprecated" in res.node ? res.node : null;
    },
    null,
    { shallow: false }
);

const shape = computed(() => {
    const node = template.value;
    return node != undefined && "shapeType" in node ? node : undefined;
});

const marker = computed(() => {
    const node = template.value;
    return node != undefined && "markerType" in node ? node : undefined;
});

const stroke = computed(() => shape.value?.stroke ?? marker.value?.stroke);

// the stroke is edited as one unit, InputWrapper hands the slot a deep copy of this
const strokeState = computed(() => ({
    color: stroke.value?.color ?? "",
    dash: stroke.value?.dash?.join(", ") ?? ""
}));

const shapeTypeItems = Object.values(ShapeType).map((value) => ({ title: humanizeEnumValue(value), value }));
const markerTypeItems = Object.values(MarkerType).map((value) => ({ title: humanizeEnumValue(value), value }));

async function save(input: { name?: string; description?: string }) {
    // the type annotations are what reject fields an input does not have, requestThrow does not check its variables
    const id = templateId.value;
    await withUpdateErrorMessage(async () => {
        switch (props.kind) {
            case "issue": {
                const updateInput: UpdateIssueTemplateInput = { id, ...input };
                await requestThrow(updateIssueTemplateMutation, { input: updateInput });
                break;
            }
            case "artefact": {
                const updateInput: UpdateArtefactTemplateInput = { id, ...input };
                await requestThrow(updateArtefactTemplateMutation, { input: updateInput });
                break;
            }
            case "component": {
                const updateInput: UpdateComponentTemplateInput = { id, ...input };
                await requestThrow(updateComponentTemplateMutation, { input: updateInput });
                break;
            }
            case "interface-specification": {
                const updateInput: UpdateInterfaceSpecificationTemplateInput = { id, ...input };
                await requestThrow(updateInterfaceSpecificationTemplateMutation, { input: updateInput });
                break;
            }
            case "relation": {
                const updateInput: UpdateRelationTemplateInput = { id, ...input };
                await requestThrow(updateRelationTemplateMutation, { input: updateInput });
                break;
            }
        }
    });
    if ("name" in input) {
        eventBus?.emit("title-segment-changed");
    }
}

async function saveShapeType(shapeType: ShapeType) {
    await saveShape({ shapeType });
}

async function saveShapeRadius(shapeRadius: number | null) {
    await saveShape({ shapeRadius });
}

// only component and interface specification templates have a shape
async function saveShape(input: { shapeType?: ShapeType; shapeRadius?: number | null }) {
    const id = templateId.value;
    await withUpdateErrorMessage(async () => {
        if (props.kind == "component") {
            const updateInput: UpdateComponentTemplateInput = { id, ...input };
            await requestThrow(updateComponentTemplateMutation, { input: updateInput });
        } else if (props.kind == "interface-specification") {
            const updateInput: UpdateInterfaceSpecificationTemplateInput = { id, ...input };
            await requestThrow(updateInterfaceSpecificationTemplateMutation, { input: updateInput });
        }
    });
}

async function saveFill(color: string) {
    await saveStyle({ fill: color ? { color } : null });
}

async function saveStroke(state: { color: string; dash: string }) {
    const dash = parseStrokeDash(state.dash);
    const hasStroke = !!state.color || dash != undefined;
    await saveStyle({ stroke: hasStroke ? { color: state.color || undefined, dash } : null });
}

// only relation partner templates have a fill, relation templates only have a stroke
async function saveStyle(input: { fill?: FillStyleInput | null; stroke?: StrokeStyleInput | null }) {
    const id = templateId.value;
    await withUpdateErrorMessage(async () => {
        if (props.kind == "component") {
            const updateInput: UpdateComponentTemplateInput = { id, ...input };
            await requestThrow(updateComponentTemplateMutation, { input: updateInput });
        } else if (props.kind == "interface-specification") {
            const updateInput: UpdateInterfaceSpecificationTemplateInput = { id, ...input };
            await requestThrow(updateInterfaceSpecificationTemplateMutation, { input: updateInput });
        } else if (props.kind == "relation") {
            const updateInput: UpdateRelationTemplateInput = { id, stroke: input.stroke };
            await requestThrow(updateRelationTemplateMutation, { input: updateInput });
        }
    });
}

async function saveMarkerType(markerType: MarkerType) {
    const id = templateId.value;
    await withUpdateErrorMessage(() => requestThrow(updateRelationTemplateMutation, { input: { id, markerType } }));
}

async function withUpdateErrorMessage(update: () => Promise<unknown>) {
    await withErrorMessage(update, `Error updating ${templateKindInfos[props.kind].name} template details`);
    reloadDependency.value++;
}
</script>

<style scoped lang="scss">
.field-group {
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
}

.field-label {
    font-size: 12px;
    margin-bottom: 4px;
}

.field-value {
    font-size: 16px;
}
</style>
