<template>
    <div>
        <v-row>
            <v-col v-if="shape" cols="6">
                <v-select v-model="model.shapeType" :items="shapeTypeItems" label="Shape" />
            </v-col>
            <v-col v-if="shape" cols="6">
                <v-number-input
                    v-model="model.shapeRadius"
                    :precision="null"
                    :min="0"
                    label="Corner radius"
                    hint="Ignored for circles and ellipses"
                    persistent-hint
                />
            </v-col>
            <v-col v-if="marker" cols="6">
                <v-select v-model="model.markerType" :items="markerTypeItems" label="Marker" />
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="shape" cols="6">
                <ColorInput v-model="model.fillColor" label="Fill color" />
            </v-col>
            <v-col cols="6">
                <ColorInput v-model="model.strokeColor" label="Stroke color" />
            </v-col>
            <v-col cols="6">
                <v-text-field
                    v-model="model.strokeDash"
                    label="Stroke dash"
                    hint="Dash pattern as comma separated lengths, e.g. 4, 4"
                    persistent-hint
                    :error-messages="dashErrorMessage"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import { MarkerType, ShapeType } from "@/gql/enums";
import { humanizeEnumValue, parseStrokeDash, type TemplateStyleState } from "@/util/templateInputs";
import { computed, type PropType } from "vue";
import ColorInput from "./ColorInput.vue";

const model = defineModel({
    type: Object as PropType<TemplateStyleState>,
    required: true
});

defineProps({
    /** Whether the template describes a shape, which is the case for component and interface specification templates */
    shape: {
        type: Boolean,
        required: false,
        default: false
    },
    /** Whether the template describes a relation marker */
    marker: {
        type: Boolean,
        required: false,
        default: false
    }
});

const shapeTypeItems = Object.values(ShapeType).map((value) => ({ title: humanizeEnumValue(value), value }));
const markerTypeItems = Object.values(MarkerType).map((value) => ({ title: humanizeEnumValue(value), value }));

const dashErrorMessage = computed(() =>
    model.value.strokeDash && parseStrokeDash(model.value.strokeDash) == undefined
        ? "Must be a comma separated list of numbers"
        : ""
);
</script>
