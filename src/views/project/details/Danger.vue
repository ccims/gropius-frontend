<template>
    <div class="pa-4 h-100 overflow-y-auto">
        <DetailCompartment name="Danger Zone" color="error-container">
            <DefaultButton color="error">
                Delete project
                <ConfirmationDialog
                    title="Delete project"
                    message="Are you sure you want to delete this project? All issues only present on this project are deleted. You might loose read access to some components. This does not delete any components or their versions."
                    confirm-text="Delete project"
                    @confirm="deleteProject"
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

const deleteProjectMutation = graphql(`
    mutation deleteProject($id: ID!) {
        deleteProject(input: { id: $id }) {
            __typename
        }
    }
`);

const route = useRoute();
const router = useRouter();
const projectId = computed(() => route.params.trackable as string);

async function deleteProject() {
    const res = await request(deleteProjectMutation, { id: projectId.value });
    if (!res) return;
    router.push({ name: "home" });
}
</script>
