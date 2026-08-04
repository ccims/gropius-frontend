<template>
    <div class="pa-4 h-100 overflow-y-auto">
        <DetailCompartment name="Danger Zone" color="error-container">
            <DefaultButton color="error">
                Delete component
                <ConfirmationDialog
                    title="Delete component"
                    message="Are you sure you want to delete this component? This deletes all associated versions, interfaces, and relations. Further, all issues only present on this component are deleted."
                    confirm-text="Delete component"
                    @confirm="deleteComponent"
                />
            </DefaultButton>
        </DetailCompartment>
    </div>
</template>
<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { graphql } from "@/gql";
import { request } from "@/gql/client";

const deleteComponentMutation = graphql(`
    mutation deleteComponent($id: ID!) {
        deleteComponent(input: { id: $id }) {
            __typename
        }
    }
`);

const route = useRoute();
const router = useRouter();
const componentId = computed(() => route.params.trackable as string);

async function deleteComponent() {
    const res = await request(deleteComponentMutation, { id: componentId.value });
    if (!res) return;
    router.push({ name: "home" });
}
</script>
