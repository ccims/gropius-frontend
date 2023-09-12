<template>
    <EditableCompartment :name="name" :editable="editable">
        <template #display>
            <div v-for="itemGroup in groupedItems">
                <span class="text-subtitle-2">
                    {{ typeName(itemGroup) }}
                </span>
                <div v-for="item in itemGroup.items">
                    <slot name="ItemInfo" :item="item" />
                </div>
            </div>
        </template>
        <template #edit>
            <div v-for="(item, idx) in items" class="pt-2" :key="idx">
                <v-hover v-slot="{ isHovering, props }">
                    <div v-bind="props">
                        <div class="d-flex align-center">
                            <div>
                                <span class="text-subtitle-2 mb-2 edit-type" @click="$emit('toggleTypeEdit', item.id)">
                                    {{ typeName(item) }}
                                    <v-fade-transition>
                                        <v-icon
                                            v-if="isHovering"
                                            class="ml-1"
                                            :icon="editedTypes[item.id] ? 'mdi-pencil-off' : 'mdi-pencil'"
                                            size="small"
                                        ></v-icon>
                                    </v-fade-transition>
                                    <v-tooltip activator="parent"> Edit type </v-tooltip>
                                </span>
                                <slot name="EditedItemInfo" :item="item" />
                            </div>
                            <v-spacer />
                            <IconButton @click="$emit('removeItem', item.id)">
                                <v-icon>mdi-close</v-icon>
                                <v-tooltip activator="parent"> Remove {{ nameInline }} </v-tooltip>
                            </IconButton>
                        </div>
                        <slot name="TypeAutocomplete" :item="item" v-if="editedTypes[item.id]" />
                    </div>
                </v-hover>
                <v-divider />
            </div>
            <div class="mt-3">
                <slot name="ItemAutocomplete" />
            </div>
        </template>
    </EditableCompartment>
</template>
<script setup lang="ts" generic="T extends { id: string, name: string }, V extends { id: string, type?: T | null }">
import { computed, ref } from "vue";
import { PropType } from "vue";
import EditableCompartment from "./EditableCompartment.vue";
import { emit } from "process";

const props = defineProps({
    items: {
        type: Array as PropType<V[]>,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nameInline: {
        type: String,
        required: true
    },
    editable: {
        type: Boolean,
        required: true
    },
    editedTypes: {
        type: Object as PropType<Record<string, boolean>>,
        required: false,
        default: () => ({})
    }
});

defineEmits<{
    (event: "removeItem", value: string): void;
    (event: "toggleTypeEdit", value: string): void;
}>();

interface Group {
    type: T | undefined;
    items: V[];
}

function groupByType(items: V[]): Group[] {
    const groupedItems: Map<string | undefined, Group> = new Map();
    for (const item of items) {
        if (groupedItems.has(item.type?.id)) {
            groupedItems.get(item.type?.id)!.items.push(item);
        } else {
            groupedItems.set(item.type?.id, {
                type: item.type ?? undefined,
                items: [item]
            });
        }
    }
    return [...groupedItems.values()];
}

const groupedItems = computed(() => groupByType(props.items));

function typeName(item: V | Group): string {
    return item.type?.name ?? "[No type]";
}
</script>
<style lang="scss">
.edit-type {
    cursor: pointer;

    &:hover {
        color: rgb(var(--v-theme-primary)) !important;
    }
}
</style>