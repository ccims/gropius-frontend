<template>
    <ElementsForm
        v-if="isElementsForm(derefSchema)"
        :schema="(derefSchema as any)"
        :root-schema="rootSchema"
        :name="name"
        :modelValue="(props.modelValue as any[] | undefined)"
        @update:model-value="$emit('update:modelValue', $event)"
        :readonly="readonly"
    />
    <ValuesForm
        v-else-if="isValuesForm(derefSchema)"
        :schema="(derefSchema as any)"
        :root-schema="rootSchema"
        :name="name"
        :modelValue="(props.modelValue as Record<string, unknown> | undefined)"
        @update:model-value="$emit('update:modelValue', $event)"
        :readonly="readonly"
    />
    <ObjectForm
        v-else-if="isPropertiesForm(schema) || isDiscriminatorForm(schema)"
        :schema="(derefSchema as any)"
        :root-schema="rootSchema"
        :name="name"
        :modelValue="(props.modelValue as Record<string, unknown> | undefined)"
        @update:model-value="$emit('update:modelValue', $event)"
        :readonly="readonly"
    />
    <TypeForm
        v-else-if="isTypeForm(schema)"
        :schema="(derefSchema as any)"
        :root-schema="rootSchema"
        :name="name"
        :modelValue="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :readonly="readonly"
    />
    <EnumForm
        v-else-if="isEnumForm(schema)"
        :schema="(derefSchema as any)"
        :root-schema="rootSchema"
        :name="name"
        :modelValue="(props.modelValue as string | undefined)"
        @update:model-value="$emit('update:modelValue', $event)"
        :readonly="readonly"
    />
</template>
<script setup lang="ts">
import {
    Schema,
    isElementsForm,
    isPropertiesForm,
    isDiscriminatorForm,
    isValuesForm,
    isTypeForm,
    isEnumForm
} from "jtd";
import { computed } from "vue";
import { PropType } from "vue";
import ElementsForm from "./ElementsForm.vue";
import ValuesForm from "./ValuesForm.vue";
import ObjectForm from "./ObjectForm.vue";
import EnumForm from "./EnumForm.vue";
import TypeForm from "./TypeForm.vue";
import { derefSchemaRecursive } from "./generateDefaultData";

const props = defineProps({
    schema: {
        type: Object as PropType<Schema>,
        required: true
    },
    rootSchema: {
        type: Object as PropType<Schema>,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    modelValue: {
        required: false
    },
    readonly: {
        type: Boolean,
        required: false,
        default: false
    }
});

defineEmits({
    "update:modelValue": (value: any) => true
});

const derefSchema = computed(() => {
    return derefSchemaRecursive(props.schema, props.rootSchema)
});
</script>
