<template>
    <div>
        <template v-if="!contentOnly">
            <div class="d-flex align-center flex-wrap ga-2">
                <span
                    v-if="label != undefined"
                    class="text-body-2"
                    :class="named ? 'font-weight-medium' : 'font-italic'"
                >
                    {{ label }}
                </span>
                <SchemaTypeChip :schema="schema" :root-schema="rootSchema" />
                <v-chip v-if="optional" size="x-small" variant="outlined" class="text-medium-emphasis">
                    optional
                    <v-tooltip activator="parent" location="bottom">This field can be left out entirely</v-tooltip>
                </v-chip>
                <v-chip v-if="resolved.nullable" size="x-small" variant="outlined" class="text-medium-emphasis">
                    can be empty
                    <v-tooltip activator="parent" location="bottom">This field can be set to no value at all</v-tooltip>
                </v-chip>
            </div>
            <div v-if="description != undefined" class="text-body-2 text-medium-emphasis mt-1">{{ description }}</div>
        </template>
        <div v-if="options != undefined" class="d-flex flex-wrap ga-1" :class="contentClass">
            <v-chip
                v-for="option in options"
                :key="option"
                size="small"
                color="secondary"
                variant="tonal"
                prepend-icon="mdi-circle-medium"
            >
                {{ option }}
            </v-chip>
        </div>
        <div v-else-if="tooDeep" class="text-body-2 text-medium-emphasis" :class="contentClass">…</div>
        <div v-else-if="children.length > 0" :class="contentClass">
            <SchemaTypeTree
                v-for="(child, index) in children"
                :key="index"
                class="child"
                :schema="child.schema"
                :root-schema="rootSchema"
                :label="child.label"
                :named="child.named"
                :optional="child.optional"
                :depth="depth + 1"
            />
        </div>
    </div>
</template>
<script lang="ts" setup>
import SchemaTypeChip from "./SchemaTypeChip.vue";
import {
    resolveTemplateFieldSchema,
    templateFieldSchemaChildren,
    templateFieldSchemaDescription,
    templateFieldSchemaOptions
} from "@/util/templateFieldSpecifications";
import type { Schema } from "jtd";
import { computed, type PropType } from "vue";

/** Schemas can be recursive, at some point the tree has to stop instead of growing forever */
const maxDepth = 8;

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
    },
    /** Name of the property, or the role of the schema like "Every entry", omitted for the root */
    label: {
        type: String,
        required: false
    },
    /** Whether the label is a name taken from the schema instead of a fixed role */
    named: {
        type: Boolean,
        required: false,
        default: false
    },
    /** Whether the property may be missing entirely */
    optional: {
        type: Boolean,
        required: false,
        default: false
    },
    /**
     * Renders only what is nested inside the schema, for places that already show the type itself,
     * like the list of field specifications where the type is part of the title.
     */
    contentOnly: {
        type: Boolean,
        required: false,
        default: false
    },
    depth: {
        type: Number,
        required: false,
        default: 0
    }
});

const resolved = computed(() => resolveTemplateFieldSchema(props.schema, props.rootSchema));
const description = computed(() => templateFieldSchemaDescription(props.schema, props.rootSchema));
const options = computed(() => templateFieldSchemaOptions(props.schema, props.rootSchema));
const children = computed(() => templateFieldSchemaChildren(props.schema, props.rootSchema));
const tooDeep = computed(() => props.depth >= maxDepth && children.value.length > 0);
const contentClass = computed(() => (props.contentOnly ? "" : "nested"));
</script>
<style scoped lang="scss">
.nested {
    border-left: thin solid rgb(var(--v-theme-outline-variant));
    padding-left: 16px;
    margin-left: 7px;
    margin-top: 8px;
}

.child + .child {
    margin-top: 8px;
}
</style>
