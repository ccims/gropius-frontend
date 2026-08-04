<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="relationTemplate != undefined">
        <DetailCompartment v-if="conditions.length == 0" name="Relation Conditions">
            <v-alert type="warning" variant="tonal" density="compact">
                No conditions defined, so this template cannot be used by any relation.
            </v-alert>
        </DetailCompartment>
        <DetailCompartment
            v-for="(condition, index) in conditions"
            :key="condition.id"
            :name="`Condition ${index + 1}`"
            :class="{ 'mt-4': index > 0 }"
        >
            <div class="text-medium-emphasis mb-4">
                A relation can use this template if its start has one of the start templates and its end one of the end
                templates.
            </div>
            <div class="text-subtitle-2 mb-1">Allowed start templates</div>
            <TemplateReferenceList :templates="condition.from.nodes" empty-message="No start templates" />
            <div class="text-subtitle-2 mt-4 mb-1">Allowed end templates</div>
            <TemplateReferenceList :templates="condition.to.nodes" empty-message="No end templates" />

            <div class="text-subtitle-2 mt-4 mb-1">Interface specification derivation</div>
            <div
                v-if="condition.interfaceSpecificationDerivationConditions.nodes.length == 0"
                class="text-medium-emphasis"
            >
                No interface specifications are derived via this relation
            </div>
            <v-sheet
                v-for="derivation in condition.interfaceSpecificationDerivationConditions.nodes"
                :key="derivation.id"
                color="surface-container"
                rounded="lger"
                class="pa-3 mb-2"
                :elevation="0"
            >
                <TemplateReferenceList
                    :templates="derivation.derivableInterfaceSpecifications.nodes"
                    kind="interface-specification"
                    empty-message="No derivable interface specification templates"
                />
                <div class="d-flex flex-wrap ga-2 mt-2">
                    <v-chip v-for="flag in activeFlags(derivation)" :key="flag" size="small" color="primary">
                        {{ flag }}
                    </v-chip>
                    <span v-if="activeFlags(derivation).length == 0" class="text-medium-emphasis">
                        Nothing is derived
                    </span>
                </div>
            </v-sheet>
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
import { computed } from "vue";

const getRelationTemplateConditionsQuery = graphql(`
    query getRelationTemplateConditions($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on RelationTemplate {
                relationConditions {
                    nodes {
                        id
                        from {
                            nodes {
                                id
                                name
                                description
                            }
                        }
                        to {
                            nodes {
                                id
                                name
                                description
                            }
                        }
                        interfaceSpecificationDerivationConditions {
                            nodes {
                                id
                                derivesVisibleSelfDefined
                                derivesInvisibleSelfDefined
                                derivesVisibleDerived
                                derivesInvisibleDerived
                                isVisibleDerived
                                isInvisibleDerived
                                derivableInterfaceSpecifications {
                                    nodes {
                                        id
                                        name
                                        description
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`);

const derivationFlagLabels = {
    derivesVisibleSelfDefined: "Derives visible self-defined",
    derivesInvisibleSelfDefined: "Derives invisible self-defined",
    derivesVisibleDerived: "Derives visible derived",
    derivesInvisibleDerived: "Derives invisible derived",
    isVisibleDerived: "Derived as visible",
    isInvisibleDerived: "Derived as invisible"
} as const;

const templateId = useTemplateId();

const relationTemplate = computedAsync(
    async () => {
        if (!templateId.value) {
            return null;
        }
        return await withErrorMessage(
            () => queryNodeThrow(getRelationTemplateConditionsQuery, "RelationTemplate", { id: templateId.value }),
            "Error loading relation template details"
        );
    },
    null,
    { shallow: false }
);

const conditions = computed(() => relationTemplate.value?.relationConditions.nodes ?? []);

function activeFlags(derivation: Record<string, unknown>): string[] {
    return Object.entries(derivationFlagLabels)
        .filter(([key]) => derivation[key] === true)
        .map(([, label]) => label);
}
</script>
