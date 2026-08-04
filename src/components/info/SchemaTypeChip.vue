<template>
    <v-chip :class="`bg-${categoryColors[info.category]}`" size="small" variant="flat" :prepend-icon="info.icon">
        {{ info.label }}
        <v-tooltip activator="parent" location="bottom">
            <div>{{ info.hint }}</div>
            <!-- text-medium-emphasis is unreadable on the inverted background of a tooltip -->
            <div class="text-caption opacity-70">Schema: {{ info.technical }}</div>
        </v-tooltip>
    </v-chip>
</template>
<script lang="ts" setup>
import { templateFieldTypeInfo, type TemplateFieldTypeCategory } from "@/util/templateFieldSpecifications";
import type { Schema } from "jtd";
import { computed, type PropType } from "vue";

const categoryColors: Record<TemplateFieldTypeCategory, string> = {
    primitive: "secondary-container",
    collection: "tertiary-container",
    structure: "primary-container"
};

const props = defineProps({
    schema: {
        type: Object as PropType<Schema>,
        required: false
    },
    /**
     * The schema of the whole field specification, needed to look up the definitions `ref`s point to.
     */
    rootSchema: {
        type: Object as PropType<Schema>,
        required: true
    }
});

const info = computed(() => templateFieldTypeInfo(props.schema, props.rootSchema));
</script>
