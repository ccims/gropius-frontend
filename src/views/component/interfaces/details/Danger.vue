<template>
    <div class="pa-4 h-100 overflow-y-auto">
        <DetailCompartment name="Danger Zone" color="error-container">
            <DefaultButton color="error">
                Delete interface specification
                <ConfirmationDialog
                    title="Delete interface specification"
                    message="Are you sure you want to delete this interface specification? This deletes all associated interfaces and relations."
                    confirm-text="Delete interface specification"
                    @confirm="deleteInterfaceSpecification"
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

const deleteInterfaceSpecificationMutation = graphql(`
    mutation deleteInterfaceSpecification($id: ID!) {
        deleteInterfaceSpecification(input: { id: $id }) {
            __typename
        }
    }
`);

const route = useRoute();
const router = useRouter();
const interfaceSpecificationId = computed(() => route.params.interfaceSpecification as string);

async function deleteInterfaceSpecification() {
    const res = await request(deleteInterfaceSpecificationMutation, { id: interfaceSpecificationId.value });
    if (!res) return;
    router.push({ name: "component-details-interfaces", params: { trackable: route.params.trackable } });
}
</script>
