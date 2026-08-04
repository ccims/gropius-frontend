<template>
    <div class="pa-4 h-100 overflow-y-auto">
        <DetailCompartment name="Danger Zone" color="error-container">
            <DefaultButton color="error">
                Delete interface specification version
                <ConfirmationDialog
                    title="Delete interface specification version"
                    message="Are you sure you want to delete this interface specification version? This deletes all associated interfaces and relations."
                    confirm-text="Delete interface specification version"
                    @confirm="deleteInterfaceSpecificationVersion"
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

const deleteInterfaceSpecificationVersionMutation = graphql(`
    mutation deleteInterfaceSpecificationVersion($id: ID!) {
        deleteInterfaceSpecificationVersion(input: { id: $id }) {
            __typename
        }
    }
`);

const route = useRoute();
const router = useRouter();
const interfaceSpecificationVersionId = computed(() => route.params.interfaceSpecificationVersion as string);

async function deleteInterfaceSpecificationVersion() {
    const res = await request(deleteInterfaceSpecificationVersionMutation, {
        id: interfaceSpecificationVersionId.value
    });
    if (!res) {
        return;
    }
    router.push({
        name: "interface-specification-versions",
        params: {
            trackable: route.params.trackable,
            interfaceSpecification: route.params.interfaceSpecification
        }
    });
}
</script>
