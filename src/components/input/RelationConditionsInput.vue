<template>
    <div>
        <div class="text-medium-emphasis mb-4">
            A Relation can use this template if at least one of the conditions matches its start and end.
        </div>
        <v-btn variant="tonal" block prepend-icon="mdi-plus" @click="addCondition">Add Relation Condition</v-btn>
        <v-alert v-if="model.length == 0" type="warning" variant="tonal" density="compact" class="mt-4">
            Without a condition the template cannot be used by any relation.
        </v-alert>

        <v-card
            v-for="(condition, conditionIndex) in model"
            :key="conditionIndex"
            variant="flat"
            color="surface-container-low"
            class="mt-4 pa-3"
        >
            <div class="d-flex align-center">
                <div class="text-subtitle-1 flex-1-1">Condition {{ conditionIndex + 1 }}</div>
                <IconButton @click="removeCondition(conditionIndex)">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="bottom">Remove condition</v-tooltip>
                </IconButton>
            </div>
            <v-row>
                <v-col cols="6">
                    <TemplateAutocomplete
                        v-model="condition.from"
                        type="relationPartner"
                        multiple
                        label="Allowed start templates"
                    />
                </v-col>
                <v-col cols="6">
                    <TemplateAutocomplete
                        v-model="condition.to"
                        type="relationPartner"
                        multiple
                        label="Allowed end templates"
                    />
                </v-col>
            </v-row>

            <div class="text-subtitle-2 mt-2 mb-1">Interface Specification Derivation</div>
            <v-card
                v-for="(derivation, derivationIndex) in condition.interfaceSpecificationDerivationConditions"
                :key="derivationIndex"
                variant="flat"
                color="surface-container"
                class="mb-2 pa-3"
            >
                <div class="d-flex align-center">
                    <TemplateAutocomplete
                        v-model="derivation.derivableInterfaceSpecifications"
                        type="interfaceSpecification"
                        multiple
                        label="Derivable interface specifications"
                        class="flex-1-1"
                    />
                    <IconButton class="ms-2" @click="removeDerivation(condition, derivationIndex)">
                        <v-icon>mdi-close</v-icon>
                        <v-tooltip activator="parent" location="bottom">Remove derivation</v-tooltip>
                    </IconButton>
                </div>
                <div class="d-flex flex-wrap mx-n2">
                    <v-checkbox
                        v-for="flag in derivationFlags"
                        :key="flag.key"
                        v-model="derivation[flag.key]"
                        :label="flag.label"
                        density="compact"
                        hide-details
                        class="mx-2 flag-checkbox"
                    />
                </div>
            </v-card>
            <v-btn variant="text" size="small" prepend-icon="mdi-plus" @click="addDerivation(condition)">
                Add Derivation
            </v-btn>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import TemplateAutocomplete from "./TemplateAutocomplete.vue";

export interface DerivationConditionState {
    derivesVisibleSelfDefined: boolean;
    derivesInvisibleSelfDefined: boolean;
    derivesVisibleDerived: boolean;
    derivesInvisibleDerived: boolean;
    isVisibleDerived: boolean;
    isInvisibleDerived: boolean;
    derivableInterfaceSpecifications: string[];
}

export interface RelationConditionState {
    from: string[];
    to: string[];
    interfaceSpecificationDerivationConditions: DerivationConditionState[];
}

const derivationFlags: {
    key: keyof Omit<DerivationConditionState, "derivableInterfaceSpecifications">;
    label: string;
}[] = [
    { key: "derivesVisibleSelfDefined", label: "Derives visible self-defined" },
    { key: "derivesInvisibleSelfDefined", label: "Derives invisible self-defined" },
    { key: "derivesVisibleDerived", label: "Derives visible derived" },
    { key: "derivesInvisibleDerived", label: "Derives invisible derived" },
    { key: "isVisibleDerived", label: "Derived as visible" },
    { key: "isInvisibleDerived", label: "Derived as invisible" }
];

const model = defineModel({
    type: Array as PropType<RelationConditionState[]>,
    required: true
});

function addCondition() {
    model.value = [...model.value, { from: [], to: [], interfaceSpecificationDerivationConditions: [] }];
}

function removeCondition(index: number) {
    model.value = model.value.filter((_, other) => other != index);
}

function addDerivation(condition: RelationConditionState) {
    condition.interfaceSpecificationDerivationConditions.push({
        derivesVisibleSelfDefined: false,
        derivesInvisibleSelfDefined: false,
        derivesVisibleDerived: false,
        derivesInvisibleDerived: false,
        isVisibleDerived: false,
        isInvisibleDerived: false,
        derivableInterfaceSpecifications: []
    });
}

function removeDerivation(condition: RelationConditionState, index: number) {
    condition.interfaceSpecificationDerivationConditions.splice(index, 1);
}
</script>

<style scoped>
.flag-checkbox {
    min-width: 250px;
}
</style>
