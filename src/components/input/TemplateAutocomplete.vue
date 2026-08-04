<template>
    <FetchingAutocomplete
        :mode="multiple ? 'model-multiple' : 'model'"
        :fetch="fetchTemplates"
        :label="label"
        :dependency="type"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props" />
        </template>
    </FetchingAutocomplete>
</template>

<script setup lang="ts">
import type { AutocompleteTemplateInfoFragment } from "@/gql/graphql";
import { searchTemplates, type SearchableTemplateType } from "@/util/templateSearch";
import { withErrorMessage } from "@/util/withErrorMessage";
import type { PropType } from "vue";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";

const props = defineProps({
    type: {
        type: String as PropType<SearchableTemplateType>,
        required: true
    },
    multiple: {
        type: Boolean,
        required: false,
        default: false
    },
    label: {
        type: String,
        required: false,
        default: "Template"
    }
});

async function fetchTemplates(filter: string, count: number): Promise<AutocompleteTemplateInfoFragment[]> {
    return await withErrorMessage(() => searchTemplates(props.type, filter, count), "Error searching templates");
}
</script>
