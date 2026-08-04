<template>
    <v-select
        :items="schema.enum"
        :label="name"
        :model-value="model"
        @update:model-value="model = $event"
        :clearable="schema.nullable"
        :rules="rules"
        :readonly="readonly"
    />
</template>
<script setup lang="ts">
import type { Schema, SchemaFormEnum } from "jtd";
import { computed } from "vue";
import type { PropType } from "vue";
import { type Rule, requiredRule } from "./rules";

const props = defineProps({
    schema: {
        type: Object as PropType<SchemaFormEnum>,
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
    readonly: {
        type: Boolean,
        required: true
    }
});

const model = defineModel({
    type: String,
    required: false
});

const rules = computed(() => {
    const rules: Rule[] = [];
    if (!props.schema.nullable) {
        rules.push(requiredRule);
    }
    return rules;
});
</script>
