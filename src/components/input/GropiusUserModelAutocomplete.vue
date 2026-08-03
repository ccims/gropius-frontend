<template>
    <FetchingAutocomplete mode="model" :fetch="searchGropiusUsers" :label="label" item-title="displayName" chips>
        <template #item="{ props, item }">
            <v-list-item :title="item.raw.displayName" :subtitle="item.raw.username ?? ''" v-bind="props">
                <template #prepend>
                    <User :user="item.raw" :show-name="false" class="mr-2" />
                </template>
            </v-list-item>
        </template>
        <template #chip="{ item }">
            <User :user="<DefaultUserInfoFragment>item.raw" :show-tooltip="false" />
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { DefaultUserInfoFragment, GropiusUserFilterInput } from "@/gql/graphql";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import User from "../info/User.vue";
import type { PropType } from "vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { withErrorMessage } from "@/util/withErrorMessage";

const searchGropiusUsersQuery = graphql(`
    query searchGropiusUsers($query: String!, $count: Int!, $filter: GropiusUserFilterInput) {
        searchGropiusUsers(query: $query, first: $count, filter: $filter) {
            ...DefaultUserInfo
        }
    }
`);

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "User"
    },
    filter: {
        type: Object as PropType<GropiusUserFilterInput>,
        required: false
    }
});

async function searchGropiusUsers(filter: string, count: number): Promise<DefaultUserInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchGropiusUsersQuery, { query, count, filter: props.filter });
            return res.searchGropiusUsers;
        } else {
            return [];
        }
    }, "Error searching users");
}
</script>
