<template>
    <v-menu location="bottom" v-model="menuOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props: templateProps }">
            <v-chip v-bind="templateProps" :color="chipColor" :variant="chipVariant">
                <template #append>
                    <v-icon
                        v-if="model.length"
                        class="ml-1"
                        @click.stop="model = []"
                        aria-label="remove"
                        icon="mdi-close-circle"
                    />
                    <v-icon v-else class="ml-1" icon="mdi-menu-down" aria-hidden="true" />
                </template>
                {{ chipLabel }}
            </v-chip>
        </template>
        <v-list max-height="300px" min-width="300px">
            <div class="pa-2">
                <v-text-field
                    v-model="searchText"
                    label="Search items..."
                    density="compact"
                    hide-details
                    clearable
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    autofocus
                ></v-text-field>
            </div>
            <v-divider></v-divider>
            <template v-if="filteredItems.length > 0">
                <v-list-item v-for="item in filteredItems" :key="item.id">
                    <v-checkbox v-model="model" :value="item.id" density="compact" hide-details>
                        <template #label>
                            <slot :item="item">
                                {{ item.name }}
                            </slot>
                        </template>
                    </v-checkbox>
                    <v-tooltip v-if="item.description" :text="item.description" activator="parent" />
                </v-list-item>
            </template>
            <div v-else-if="filteredItems.length === 0" class="pa-4 text-center text-medium-emphasis">No items found.</div>
        </v-list>
    </v-menu>
</template>
<script setup lang="ts" generic="T, S extends string, I extends IdObject & { name: string; description?: string }">
import { computed, PropType, ref, watch } from "vue";
import { ItemManager } from "@/util/itemManager";
import { IdObject } from "@/util/types";

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Items"
    },
    itemManager: {
        type: Object as PropType<ItemManager<T, S | "ID">>,
        required: true
    },
    mapper: {
        type: Function as PropType<(item: T) => I | I[] | undefined | null>,
        required: true
    },
    sorter: {
        type: Function as PropType<(a: I, b: I) => number>,
        required: false,
        default: (a: I, b: I) => a.name.localeCompare(b.name)
    },
    additionalInitialValues: {
        type: Function as PropType<() => Promise<I[]>>,
        required: false,
        default: () => Promise.resolve([])
    },
    fetchOnSearch: {
        type: Function as PropType<(search: string) => Promise<I[]>>,
        required: false,
        default: () => Promise.resolve([])
    },
    filter: {
        type: Function as PropType<(item: I) => boolean>,
        required: false,
        default: () => true
    }
});

const chipLabel = computed(() => {
    if (model.value.length === 0) return props.label;
    if (model.value.length === 1) {
        const item = allItems.value.find((i) => i.id === model.value[0]);
        return item ? item.name : "Unknown Item";
    }
    return `${model.value.length} selected`;
});
const chipColor = computed(() => {
    return model.value.length > 0 ? "primary" : "outline";
});
const chipVariant = computed(() => {
    return model.value.length > 0 ? "tonal" : "outlined";
});

const menuOpen = ref(false);

const model = defineModel<string[]>({ default: () => [] });

const filteredItems = computed(() => {
    return allItems.value.filter((item) => {
        const currentSeach = searchText.value;
        if (!props.filter(item)) return false;
        if (!currentSeach) return true;
        return item.name.toLowerCase().includes(currentSeach.toLowerCase());
    });
});

const fromItemManager = computed(() => {
    return (
        props.itemManager.cachedItems.value?.[0]?.flatMap((item) => {
            const result = props.mapper(item);
            if (result === undefined || result === null) return [];
            return Array.isArray(result) ? result : [result];
        }) ?? []
    );
});

const fromFunction = ref([] as I[]);
props.additionalInitialValues().then((items) => {
    fromFunction.value = items;
});

const fromSearchFetch = ref([] as I[]);
const searchText = ref<string | null>("");

watch(searchText, async (newValue) => {
    const val = (newValue ?? "").trim();
    if (val === "") {
        fromSearchFetch.value = [];
        return;
    }
    fromSearchFetch.value = await props.fetchOnSearch(val);
});
const allItems = computed((previous?: I[]) => {
    const result: I[] = [];
    if (previous) {
        result.push(...previous);
    }
    const idSet = new Set<string>();
    for (const oldItem of result) {
        idSet.add(oldItem.id);
    }
    function handleItems(array: I[]) {
        for (const mappedItem of array) {
            const id = mappedItem.id;
            if (idSet.has(id)) continue;
            idSet.add(id);
            result.push(mappedItem);
        }
    }
    handleItems(fromItemManager.value);
    handleItems(fromFunction.value as I[]);
    handleItems(fromSearchFetch.value as I[]);
    result.sort(props.sorter);
    return result;
});
</script>

<style scoped lang="scss">
.visibility-hidden {
    visibility: hidden;
}
</style>
