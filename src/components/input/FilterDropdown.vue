<template>
    <FetchingAutocomplete
        mode="model"
        :fetch="async () => allFetched"
        :dependency="allFetched"
        :label="props.label"
        item-title="name"
        v-model="model"
    >
        <template #item="{ props, item }">
            <slot name="item" :props="props" :item="item" />
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts" generic="T, S extends string, I extends IdObject">
import FetchingAutocomplete from "@/components/input/FetchingAutocomplete.vue";
import { computed, PropType } from "vue";
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
        type: Function as PropType<(item: T) => I>,
        required: true
    },
    sorter: {
        type: Function as PropType<(a: I, b: I) => number>,
        required: true
    }
})

const model = defineModel<string | undefined>();

const allFetched = computed(() => {
    const result: I[] = [];
    const idSet = new Set<string>();
    for (const item of props.itemManager.cachedItems.value?.[0] ?? []) {
        const mappedItem = props.mapper(item);
        const id = mappedItem.id;
        if (idSet.has(id)) continue;
        idSet.add(id);
        result.push(mappedItem);
    }
    result.sort(props.sorter);
    return result;
});

</script>

<style scoped lang="scss">

</style>
