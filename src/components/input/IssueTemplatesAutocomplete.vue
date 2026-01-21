<template>
    <FetchingAutocomplete mode="model-multiple" :fetch="searchIssueTemplates" label="Template" item-title="name">
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { useClient } from "@/graphql/client";
import { DefaultIssueTemplateInfoFragment } from "@/graphql/generated";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const client = useClient();

async function searchIssueTemplates(filter: string, count: number): Promise<DefaultIssueTemplateInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await client.searchIssueTemplates({ query, count });
            return res.searchIssueTemplates;
        } else {
            const res = await client.firstIssueTemplates({ count });
            return res.issueTemplates.nodes;
        }
    }, "Error searching issue templates");
}
</script>
