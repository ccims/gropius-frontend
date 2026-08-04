<template>
    <v-switch
        v-model="target.isSyncSelfAllowed"
        @update:model-value="updateSyncSelfAllowed($event ?? false)"
        label="Allow sync self"
        class="ml-10"
        @click.stop
    />
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { DefaultSyncPermissionTargetInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import type { PropType } from "vue";

const updateSyncPermissionsMutation = graphql(`
    mutation updateSyncPermissionsForSwitch($input: UpdateSyncPermissionsInput!) {
        updateSyncPermissions(input: $input) {
            __typename
        }
    }
`);

const props = defineProps({
    target: {
        type: Object as PropType<DefaultSyncPermissionTargetInfoFragment>,
        required: true
    }
});

async function updateSyncSelfAllowed(value: boolean) {
    await withErrorMessage(async () => {
        await requestThrow(updateSyncPermissionsMutation, {
            input: {
                id: props.target.id,
                canSyncSelf: value
            }
        });
    }, "Failed to update sync self permission");
}
</script>
