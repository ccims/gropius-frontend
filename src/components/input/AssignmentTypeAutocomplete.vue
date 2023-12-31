<template>
    <FetchingAutocomplete mode="model" :fetch="searchAssignmentTypes" :dependency="template" label="Assignment type">
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { NodeReturnType, useClient } from "@/graphql/client";
import { DefaultAssignmentTypeInfoFragment } from "@/graphql/generated";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

const props = defineProps({
    template: {
        type: String,
        required: false
    }
});

const client = useClient();

async function searchAssignmentTypes(filter: string, count: number): Promise<DefaultAssignmentTypeInfoFragment[]> {
    if (props.template == undefined) {
        return [];
    }
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await client.searchAssignmentTypes({ template: props.template!, query, count });
            return res.searchAssignmentTypes;
        } else {
            const res = await client.firstAssignmentTypes({ template: props.template!, count });
            const nodeRes = res.node as NodeReturnType<"firstAssignmentTypes", "IssueTemplate">;
            return nodeRes.assignmentTypes.nodes;
        }
    }, "Error searching issue types");
}
</script>
