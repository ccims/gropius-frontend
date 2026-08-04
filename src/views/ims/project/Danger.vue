<template>
    <div class="pa-4 h-100 overflow-y-auto">
        <DetailCompartment name="Danger Zone" color="error-container">
            <SyncOthersAllowedSwitch :target="imsProjectId" />
            <v-divider class="mb-3 mt-1" />
            <DefaultButton color="error">
                Delete IMS project
                <ConfirmationDialog
                    title="Delete IMS project"
                    message="Are you sure you want to delete this IMS project?"
                    confirm-text="Delete IMS project"
                    @confirm="deleteIMSProject"
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

const deleteIMSProjectMutation = graphql(`
    mutation deleteIMSProject($id: ID!) {
        deleteIMSProject(input: { id: $id }) {
            __typename
        }
    }
`);

const route = useRoute();
const router = useRouter();
const imsProjectId = computed(() => route.params.project as string);

async function deleteIMSProject() {
    const res = await request(deleteIMSProjectMutation, { id: imsProjectId.value });
    if (res) {
        router.push({ name: "ims", params: { trackable: route.params.ims } });
    }
}
</script>
