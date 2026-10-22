<template>
    <div class="d-flex h-100 flex-column">
        <div class="d-flex align-center mt-3 mb-2 ml-3 top-bar">
            <v-text-field
                v-model="searchString"
                label="Search"
                class="search-field"
                prepend-inner-icon="mdi-magnify"
                clearable
            >
            </v-text-field>
            <slot name="search-append" />
            <div
                class="sort-container d-flex mr-3"
                :class="{ hidden: transformedSearchQuery != undefined, 'sort-container-small': !multipleSortFields }"
            >
                <v-select
                    v-if="multipleSortFields"
                    v-model="currentSortField"
                    label="Sort by"
                    class="ml-2"
                    :class="{ hidden: transformedSearchQuery != undefined }"
                    variant="outlined"
                    :items="Object.keys(sortFields as Record<string, unknown>)"
                ></v-select>
                <v-btn icon variant="outlined" @click="toggleSortDirection()" class="ml-2">
                    <v-icon :icon="sortAscending ? 'mdi-sort-ascending' : 'mdi-sort-descending'" />
                    <v-tooltip activator="parent" location="bottom"> Toggle sort sort </v-tooltip>
                </v-btn>
            </div>
        </div>
        <div class="mx-3 mb-1">
            <slot name="additional-filter" />
        </div>
        <v-progress-linear v-if="loading" indeterminate aria-label="Loading results" />
        <v-alert v-if="loadError" type="error" class="mx-3 mb-2" density="compact">
            Could not load {{ name }}. <v-btn variant="text" @click="updateItems(false)">Retry</v-btn>
        </v-alert>
        <div class="overflow-y-auto flex-1-1 px-3">
            <div v-if="currentItems.length == 0 && loadedInitially" class="text-medium-emphasis">
                No {{ name }} found
            </div>
            <div v-if="searchPageInfo" class="d-flex align-center justify-center ga-3 my-3">
                <span class="text-medium-emphasis">Sorted by relevance</span>
                <v-btn variant="text" :disabled="loading || currentPage <= 1" @click="currentPage--">Previous</v-btn>
                <span>Page {{ currentPage }}</span>
                <v-btn variant="text" :disabled="loading || !searchPageInfo.hasNextPage" @click="currentPage++"
                    >Next</v-btn
                >
            </div>
            <CustomList :items="currentItems" :to="to">
                <template #item="{ item }">
                    <slot name="item" :item="item" />
                </template>
            </CustomList>
            <div
                v-if="pageCount > 1 && transformedSearchQuery == undefined"
                class="d-flex justify-center pagination-container"
            >
                <v-pagination v-model="currentPage" :length="pageCount" class="pagination flex-1-1"></v-pagination>
            </div>
        </div>
        <slot />
    </div>
</template>
<script setup lang="ts" generic="T, S extends string, K extends string">
import { watch, unref, nextTick, onBeforeUnmount } from "vue";
import { type Ref, onMounted } from "vue";
import { type PropType, ref } from "vue";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";
import CustomList from "./CustomList.vue";
import { computed } from "vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import type { WritableComputedRef } from "vue";
import { ItemManager } from "@/util/itemManager";

const props = defineProps({
    sortFields: {
        type: Object as PropType<Record<K, S | "ID" | (S | "ID")[]>>,
        required: true
    },
    sortAscendingInitially: {
        type: Boolean,
        default: true
    },
    itemManager: {
        type: Object as PropType<ItemManager<T, S | "ID">>,
        required: true
    },
    itemCount: {
        type: Number,
        required: false,
        default: 25
    },
    to: {
        type: Function as PropType<(item: T) => RouteLocationRaw | undefined>,
        required: true
    },
    dependencies: {
        type: Array as PropType<any[]>,
        required: false,
        default: () => []
    },
    name: {
        type: String,
        required: true
    },
    queryParamPrefix: {
        type: String,
        required: false
    }
});

const route = useRoute();
const router = useRouter();

const queryMode = computed(() => props.queryParamPrefix != undefined);
const multipleSortFields = computed(() => Object.keys(props.sortFields as Record<K, unknown>).length > 1);

const searchString = useQueryParam(
    "search",
    "",
    (value) => value,
    (value) => value
);
const transformedSearchQuery = computed(() => transformSearchQuery(searchString.value ?? ""));
const currentSortField = useQueryParam<K>(
    "sort",
    Object.keys(props.sortFields as Record<K, unknown>)[0] as K,
    (value) => value as K,
    (value) => value
);
const sortAscending = useQueryParam(
    "asc",
    props.sortAscendingInitially,
    (value) => value == "true",
    (value) => value.toString()
);
const loadedInitially = ref(false);
const loading = ref(false);
const loadError = ref(false);
const searchPageInfo = ref<{ hasNextPage: boolean }>();
let requestGeneration = 0;

const pageCount = ref(0);
const currentPage = useQueryParam(
    "page",
    1,
    (value) => {
        const page = Number(value);
        return Number.isSafeInteger(page) && page > 0 ? page : 1;
    },
    (value) => value.toString()
);
const currentItems = ref<T[]>([]) as Ref<T[]>;

function toggleSortDirection() {
    sortAscending.value = !sortAscending.value;
}

let dependenciesReady = false;
onMounted(async () => {
    // Let slot refs and URL-backed dropdown filters hydrate before the initial fetch.
    await nextTick();
    dependenciesReady = true;
    await updateItems(false);
});
onBeforeUnmount(() => {
    ++requestGeneration;
});

watch([transformedSearchQuery, currentSortField, sortAscending], async () => {
    await updateItems(true);
});

watch(currentPage, async () => {
    await updateItems(false);
});
watch(
    () => props.itemCount,
    () => updateItems(true)
);

watch(
    () => JSON.stringify(props.dependencies.map((dependency) => unref(dependency))),
    async () => {
        if (dependenciesReady) await updateItems(true);
    }
);

async function updateItems(resetPage: boolean) {
    if (resetPage && currentPage.value !== 1) {
        ++requestGeneration;
        currentPage.value = 1;
        return; // The page watcher loads the new first page.
    }
    const generation = ++requestGeneration;
    loading.value = true;
    loadError.value = false;
    const fields = props.sortFields as Record<K, S | S[]>;
    const sortField: S | S[] | "ID" = fields[currentSortField.value] ?? (Object.values(fields)[0] as S | S[]);
    const sortFields = Array.isArray(sortField) ? sortField : [sortField];
    const sortFieldsWithId = sortFields.includes("ID") ? sortFields : ([...sortFields, "ID"] as const);

    try {
        const [items, count] = await props.itemManager.fetchItemsCaching(
            transformedSearchQuery.value,
            sortFieldsWithId.map((field) => ({
                field,
                direction: sortAscending.value ? "ASC" : "DESC"
            })),
            props.itemCount,
            currentPage.value - 1
        );
        if (generation !== requestGeneration) return;
        if (typeof count === "number" && currentPage.value > Math.max(1, Math.ceil(count / props.itemCount))) {
            currentPage.value = Math.max(1, Math.ceil(count / props.itemCount));
            return;
        }
        loadedInitially.value = true;
        currentItems.value = items;
        pageCount.value = typeof count === "number" ? Math.ceil(count / props.itemCount) : 0;
        searchPageInfo.value = typeof count === "number" ? undefined : count;
    } catch (error) {
        if (generation !== requestGeneration) return;
        console.error(error);
        loadError.value = true;
        currentItems.value = [];
        pageCount.value = 0;
        searchPageInfo.value = undefined;
    } finally {
        if (generation === requestGeneration) loading.value = false;
    }
}

function useQueryParam<T>(
    key: string,
    initialValue: T,
    parse: (value: string) => T,
    stringify: (value: T) => string
): WritableComputedRef<T> {
    const _value = ref<T>(initialValue) as Ref<T>;
    return computed<T>({
        get: () => {
            if (queryMode.value) {
                const value = route.query[props.queryParamPrefix + key];
                if (value) {
                    return parse(value as string);
                } else {
                    return initialValue;
                }
            }
            return _value.value;
        },
        set: (value: T) => {
            if (queryMode.value) {
                updateQuery(key, value === "" ? undefined : stringify(value));
            } else {
                _value.value = value;
            }
        }
    });
}

function updateQuery(key: string, value: string | undefined) {
    router.replace({
        query: {
            ...route.query,
            [props.queryParamPrefix + key]: value
        }
    });
}
</script>
<style scoped>
.sort-container {
    flex: 0 1 300px;
    overflow-x: clip;
    min-width: 0;
    transition: flex-basis 0.6s ease-in-out;
}

.sort-container.hidden.sort-container-small,
.sort-container.hidden {
    flex-basis: 0px;
}

.search-field {
    flex: 1 1 250px;
}

.top-bar :deep(.v-input__details) {
    display: none !important;
}

.pagination {
    max-width: 600px;
}

.pagination-container {
    flex: 1 1 300px;
}

.sort-container.sort-container-small {
    flex-basis: 56px;
}
</style>
