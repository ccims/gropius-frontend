<template>
    <FetchingAutocomplete
        :mode="multiple ? 'model-multiple' : 'model'"
        :fetch="searchComponentTemplates"
        label="Template"
        item-title="name"
    >
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { useClient } from "@/graphql/client";
import { DefaultComponentTemplateInfoFragment } from "@/graphql/generated";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

defineProps({
    multiple: {
        type: Boolean,
        required: false,
        default: false
    }
});

const client = useClient();

async function searchComponentTemplates(
    filter: string,
    count: number
): Promise<DefaultComponentTemplateInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await client.searchComponentTemplates({ query, count });
            return res.searchComponentTemplates;
        } else {
            const res = await client.firstComponentTemplates({ count });
            return res.componentTemplates.nodes;
        }
    }, "Error searching component templates");
}
</script>
