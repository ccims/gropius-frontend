<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="componentVersion != undefined && component != undefined">
        <DetailCompartment name="General">
            <InputWrapper
                v-model="componentVersion.version"
                v-slot="{ modelValue }"
                @save="save({ version: $event })"
                :readonly="!component.admin"
            >
                <v-text-field v-model="modelValue.value" label="Version" :readonly="!component.admin" />
            </InputWrapper>
            <InputWrapper
                v-model="componentVersion.tags"
                v-slot="{ modelValue }"
                @save="save({ tags: $event })"
                :readonly="!component.admin"
            >
                <v-combobox
                    v-model="modelValue.value"
                    label="Tags"
                    multiple
                    chips
                    closable-chips
                    clearable
                    :readonly="!component.admin"
                />
            </InputWrapper>
        </DetailCompartment>
        <TemplatedFieldsDetailCompartment
            :templated-node="componentVersion"
            :readonly="!component.admin"
            :save="save"
            class="mt-4"
        />
    </div>
</template>
<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import InputWrapper from "@/components/input/InputWrapper.vue";
import TemplatedFieldsDetailCompartment from "@/components/TemplatedFieldsDetailCompartment.vue";
import { UpdateComponentVersionInput } from "@/gql/graphql";
import { eventBusKey, trackableKey } from "@/util/keys";
import { computedAsync } from "@vueuse/core";
import { computed, inject } from "vue";
import { useRoute } from "vue-router";
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { withErrorMessage } from "@/util/withErrorMessage";

const getComponentVersionGeneralDetailsQuery = graphql(`
    query getComponentVersionGeneralDetails($id: ID!) {
        node(id: $id) {
            id
            ... on ComponentVersion {
                version
                tags
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
            }
        }
    }
`);

const updateComponentVersionMutation = graphql(`
    mutation updateComponentVersion($input: UpdateComponentVersionInput!) {
        updateComponentVersion(input: $input) {
            componentVersion {
                id
            }
        }
    }
`);

const route = useRoute();
const eventBus = inject(eventBusKey);
const componentVersionId = computed(() => route.params.version as string);

const component = inject(trackableKey);

const componentVersion = computedAsync(
    async () => {
        if (!componentVersionId.value) {
            return null;
        }
        return await withErrorMessage(
            () =>
                queryNodeThrow(getComponentVersionGeneralDetailsQuery, "ComponentVersion", {
                    id: componentVersionId.value
                }),
            "Error loading component version details"
        );
    },
    null,
    { shallow: false }
);

async function save(input: Omit<UpdateComponentVersionInput, "id">) {
    await withErrorMessage(
        () =>
            requestThrow(updateComponentVersionMutation, {
                input: {
                    id: componentVersionId.value,
                    ...input
                }
            }),
        "Error updating componentVersion details"
    );
    if ("name" in input) {
        eventBus?.emit("title-segment-changed");
    }
}
</script>
