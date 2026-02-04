<template>
    <div class="pa-4 h-100 overflow-y-auto">
        <DetailCompartment name="Danger Zone" color="error-container">
            <SyncOthersAllowedSwitch :target="imsId" />
            <v-divider class="mb-3 mt-1" />
            <DefaultButton color="error">
                Delete IMS
                <ConfirmationDialog
                    title="Delete IMS"
                    message="Are you sure you want to delete this IMS? This deletes all associated IMS projects."
                    confirm-text="Delete IMS"
                    @confirm="deleteIMS"
                />
            </DefaultButton>
        </DetailCompartment>
    </div>
</template>
<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import SyncOthersAllowedSwitch from "@/components/input/SyncOthersAllowedSwitch.vue";
import { request } from "@/gql/client";
import { graphql } from "@/gql";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const deleteIMSMutation = graphql(`
    mutation deleteIMS($id: ID!) {
        deleteIMS(input: { id: $id }) {
            __typename
        }
    }
`);

const route = useRoute();
const router = useRouter();
const imsId = computed(() => route.params.ims as string);

async function deleteIMS() {
    const res = await request(deleteIMSMutation, { id: imsId.value });
    if (res) {
        router.push({ name: "home" });
    }
}
</script>
