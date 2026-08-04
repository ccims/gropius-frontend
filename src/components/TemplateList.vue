<template>
    <PaginatedList
        :name="name"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="to"
        :dependencies="[showDeprecated]"
        query-param-prefix=""
    >
        <template #search-append>
            <v-btn-toggle class="segmented-button ml-2" mandatory v-model="deprecationIndex">
                <v-btn :prepend-icon="showDeprecated ? 'mdi-file-document-outline' : 'mdi-check'">Active</v-btn>
                <v-btn :prepend-icon="showDeprecated ? 'mdi-check' : 'mdi-archive'">Deprecated</v-btn>
            </v-btn-toggle>
        </template>
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #append>
                    <div class="text-medium-emphasis field-count">
                        <v-icon icon="mdi-form-textbox" />
                        {{ item.templateFieldSpecifications.length }} fields
                    </div>
                </template>
            </ListItem>
        </template>

        <slot />
    </PaginatedList>
</template>

<script lang="ts" setup generic="T extends TemplateListItem">
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";
import ListItem from "./ListItem.vue";
import PaginatedList from "./PaginatedList.vue";
import type { ItemManager } from "@/util/itemManager";
import type { TemplateOrderField } from "@/util/templateItemManager";
import { useShowDeprecated } from "@/util/templates";

export interface TemplateListItem {
    name: string;
    description: string;
    templateFieldSpecifications: { name: string }[];
}

defineProps({
    /** Plural name of the listed templates, used in the empty state */
    name: {
        type: String,
        required: true
    },
    itemManager: {
        type: Object as PropType<ItemManager<T, TemplateOrderField>>,
        required: true
    },
    to: {
        type: Function as PropType<(template: T) => RouteLocationRaw>,
        required: true
    }
});

const { showDeprecated, deprecationIndex } = useShowDeprecated();

// every template type can be ordered by both of these
const sortFields: Record<string, TemplateOrderField> = { Name: "NAME", "[Default]": "ID" };
</script>

<style scoped lang="scss">
@use "@/styles/settings";

.field-count {
    min-width: settings.$icon-with-number-width;
}
</style>
