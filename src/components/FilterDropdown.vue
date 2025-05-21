<template>
    <v-menu location="bottom" v-model="menuOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn-group variant="flat" divided>
                <v-btn color="primary" class="h-100" variant="outlined" append-icon="mdi-menu-down" v-bind="props">
                    {{ selected ? selected : "Labels" }}
                </v-btn>
                <v-btn v-if="selected" icon @click="selected = undefined" color="primary" variant="outlined">
                    <v-icon icon="mdi-close" />
                    <v-tooltip activator="parent" location="bottom">Clear filter</v-tooltip>
                </v-btn>
            </v-btn-group>
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
            <div v-if="allItemsLoading" class="pa-4 text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <div class="mt-2">Loading...</div>
            </div>
            <template v-else-if="allItemsFiltered.length > 0">
                <v-list-item
                    v-for="(item, index) in allItemsFiltered"
                    :key="index"
                    :value="index"
                    @click="
                        menuOpen = false;
                        selected = item;
                    "
                >
                    {{ item }}
                </v-list-item>
            </template>
            <div v-else-if="allItemsLoaded && allItemsFiltered.length === 0" class="pa-4 text-center text-grey">
                No items found.
            </div>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType, Ref } from "vue";
const props = defineProps({
    loadOptions: {
        type: Function as PropType<() => Promise<string[]>>,
        required: true
    }
});
const allItems = ref<string[]>([]);
const allItemsLoading = ref(false);
const allItemsLoaded = ref(false);
const menuOpen = ref(false);
const searchText: Ref<string | null> = ref(null);
const allItemsFiltered = computed(() => {
    return allItems.value.filter(
        (item) => searchText.value === null || item.toLowerCase().includes(searchText.value?.toLowerCase())
    );
});
const selected = defineModel<string | undefined>("selected", {
    type: String,
    default: undefined
});
const loadItems = async () => {
    if (allItemsLoaded.value || allItemsLoading.value) {
        return;
    }
    allItemsLoading.value = true;
    allItems.value = await props.loadOptions();
    allItemsLoading.value = false;
    allItemsLoaded.value = true;
};

watch(menuOpen, (value) => {
    if (value) {
        loadItems();
    }
});
</script>

<style scoped></style>
