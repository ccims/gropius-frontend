<template>
    <div>
        <MetaForm
            v-for="(field, idx) in mergedFields"
            :key="idx"
            :name="field.name"
            v-model="field.value.value"
            @update:model-value="field.value.value = $event"
            :schema="field.schema.value"
            :root-schema="field.schema.value"
        />
        <div v-if="mergedFields.length == 0">No templated fields available</div>
    </div>
</template>
<script setup lang="ts">
import { type PropType, computed } from "vue";
import MetaForm from "@/components/input/schema/MetaForm.vue";

export interface Field {
    name: string;
    value?: any | null;
}

const props = defineProps({
    schema: {
        type: Array as PropType<Field[]>,
        required: true
    },
    modelValue: {
        type: Array as PropType<Field[]>,
        required: true
    }
});

const mergedFields = computed(() => {
    const fields: { name: string; schema: Field; value: Field }[] = [];
    const valueLookup = new Map<string, Field>();
    for (const field of props.modelValue) {
        valueLookup.set(field.name, field);
    }
    for (const field of props.schema) {
        fields.push({
            name: field.name,
            schema: field,
            value: valueLookup.get(field.name)!
        });
    }
    return fields;
});
</script>
