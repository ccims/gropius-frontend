<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="ims != undefined">
        <DetailCompartment name="General">
            <InputWrapper
                v-model="ims.name"
                v-slot="{ modelValue }"
                @save="save({ name: $event })"
                :readonly="!ims.admin"
            >
                <v-text-field v-model="modelValue.value" label="Name" :readonly="!ims.admin" />
            </InputWrapper>
            <InputWrapper
                v-model="ims.description"
                v-slot="{ modelValue }"
                @save="save({ description: $event })"
                :readonly="!ims.admin"
            >
                <v-textarea v-model="modelValue.value" label="Description" :readonly="!ims.admin" />
            </InputWrapper>
        </DetailCompartment>
        <TemplatedFieldsDetailCompartment :templated-node="ims" :readonly="!ims.admin" :save="save" class="mt-4" />
    </div>
</template>
<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import InputWrapper from "@/components/input/InputWrapper.vue";
import TemplatedFieldsDetailCompartment from "@/components/TemplatedFieldsDetailCompartment.vue";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { UpdateComponentInput } from "@/gql/graphql";
import { eventBusKey } from "@/util/keys";
import { computedAsync } from "@vueuse/core";
import { computed, inject } from "vue";
import { useRoute } from "vue-router";
import { withErrorMessage } from "@/util/withErrorMessage";

const getIMSGeneralDetailsQuery = graphql(`
    query getIMSGeneralDetails($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IMS {
                name
                description
                templatedFields {
                    name
                    value
                }
                template {
                    templateFieldSpecifications {
                        name
                        value
                    }
                }
                admin: hasPermission(permission: ADMIN)
            }
        }
    }
`);

const updateIMSMutation = graphql(`
    mutation updateIMS($input: UpdateIMSInput!) {
        updateIMS(input: $input) {
            ims {
                id
            }
        }
    }
`);

const route = useRoute();
const eventBus = inject(eventBusKey);
const imsId = computed(() => route.params.ims as string);

const ims = computedAsync(
    async () => {
        if (!imsId.value) {
            return null;
        }

        return await withErrorMessage(
            () => queryNodeThrow(getIMSGeneralDetailsQuery, "IMS", { id: imsId.value }),
            "Error loading IMS details"
        );
    },
    null,
    { shallow: false }
);

async function save(input: Omit<UpdateComponentInput, "id">) {
    await withErrorMessage(
        () =>
            requestThrow(updateIMSMutation, {
                input: {
                    id: imsId.value,
                    ...input
                }
            }),
        "Error updating IMS details"
    );
    if ("name" in input) {
        eventBus?.emit("title-segment-changed");
    }
}
</script>
