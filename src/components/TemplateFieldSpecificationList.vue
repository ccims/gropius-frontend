<template>
    <div v-if="fields.length == 0" class="d-flex flex-column align-center ga-2 py-4 text-medium-emphasis">
        <v-icon icon="mdi-form-textbox" size="32" />
        <div class="text-body-2">No template field specifications defined</div>
    </div>
    <template v-else>
        <div class="d-flex align-center mb-1">
            <div class="text-body-2 text-medium-emphasis">
                {{ fields.length == 1 ? "1 field" : `${fields.length} fields` }}
            </div>
            <v-spacer />
            <v-btn
                v-if="expandableNames.length > 0"
                variant="text"
                size="small"
                :prepend-icon="allExpanded ? 'mdi-unfold-less-horizontal' : 'mdi-unfold-more-horizontal'"
                @click="toggleAll"
            >
                {{ allExpanded ? "Collapse all" : "Expand all" }}
            </v-btn>
        </div>
        <CustomList :items="fields" :to="() => undefined">
            <template #item="{ item }">
                <ListItem :subtitle="item.summary">
                    <template #title>
                        <v-list-item-title class="flex-0-1-auto">{{ item.name }}</v-list-item-title>
                        <SchemaTypeChip class="ms-3 flex-shrink-0" :schema="item.schema" :root-schema="item.schema" />
                        <v-chip
                            v-if="item.nullable"
                            class="ms-2 flex-shrink-0 text-medium-emphasis"
                            size="x-small"
                            variant="outlined"
                        >
                            can be empty
                            <v-tooltip activator="parent" location="bottom">
                                This field can be set to no value at all
                            </v-tooltip>
                        </v-chip>
                    </template>
                    <template #append-line>
                        <Transition name="details">
                            <div v-if="expanded.has(item.name)" class="details pt-2 pb-1">
                                <v-sheet color="surface-container-lowest" rounded="lg" class="pa-3">
                                    <SchemaTypeTree :schema="item.schema" :root-schema="item.schema" content-only />
                                </v-sheet>
                            </div>
                        </Transition>
                    </template>
                    <template #append>
                        <!-- no tooltip on purpose, an overlay per row is not worth the two words it shows -->
                        <IconButton
                            v-if="item.expandable"
                            class="align-self-start"
                            :aria-label="expanded.has(item.name) ? 'Hide details' : 'Show details'"
                            @click="toggle(item.name)"
                        >
                            <v-icon :icon="expanded.has(item.name) ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                        </IconButton>
                    </template>
                </ListItem>
            </template>
        </CustomList>
    </template>
</template>

<script lang="ts" setup>
import { computed, ref, type PropType } from "vue";
import CustomList from "./CustomList.vue";
import ListItem from "./ListItem.vue";
import SchemaTypeChip from "./info/SchemaTypeChip.vue";
import SchemaTypeTree from "./info/SchemaTypeTree.vue";
import {
    describeTemplateFieldSpecification,
    hasTemplateFieldSchemaDetails,
    resolveTemplateFieldSchema,
    templateFieldSchemaDescription
} from "@/util/templateFieldSpecifications";
import type { Schema } from "jtd";

const props = defineProps({
    fieldSpecifications: {
        type: Array as PropType<{ name: string; value: any }[]>,
        required: true
    }
});

const fields = computed(() =>
    props.fieldSpecifications
        .map((field) => {
            const schema: Schema = typeof field.value === "object" && field.value != undefined ? field.value : {};
            return {
                name: field.name,
                schema,
                nullable: resolveTemplateFieldSchema(schema, schema).nullable === true,
                // a schema that documents itself says more than the generated description
                summary:
                    templateFieldSchemaDescription(schema, schema) ??
                    describeTemplateFieldSpecification(schema, schema),
                expandable: hasTemplateFieldSchemaDetails(schema, schema)
            };
        })
        // the API returns the specifications in no particular order, sorting keeps the list stable
        .sort((first, second) => first.name.localeCompare(second.name))
);

const expanded = ref(new Set<string>());

const expandableNames = computed(() => fields.value.filter((field) => field.expandable).map((field) => field.name));
const allExpanded = computed(() => expandableNames.value.every((name) => expanded.value.has(name)));

function toggle(name: string) {
    const next = new Set(expanded.value);
    if (!next.delete(name)) {
        next.add(name);
    }
    expanded.value = next;
}

function toggleAll() {
    expanded.value = allExpanded.value ? new Set() : new Set(expandableNames.value);
}
</script>

<style scoped>
/*
 * The row takes its full height in one go and only the panel itself fades and slides in. Opacity and
 * transform are compositor properties, so the animation costs no layout, unlike an animated height.
 */
.details-enter-active {
    transition:
        opacity 0.15s ease,
        transform 0.15s ease;
    will-change: opacity, transform;
}

.details-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

/*
 * Closing is not animated: the space can only be freed once the element is gone, so a fade out would
 * hold the space open and then let everything below jump at the very end.
 */

/* keeps the layout of the panel to itself, so opening one row does not reflow the others */
.details {
    contain: layout;
}
</style>
