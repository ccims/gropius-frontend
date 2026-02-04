<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="imsProject != undefined">
        <DetailCompartment name="General">
            <InputWrapper
                v-model="imsProject.name"
                v-slot="{ modelValue }"
                @save="save({ name: $event })"
                :readonly="!hasPermission"
            >
                <v-text-field v-model="modelValue.value" label="Name" :readonly="!hasPermission" />
            </InputWrapper>
            <InputWrapper
                v-model="imsProject.description"
                v-slot="{ modelValue }"
                @save="save({ description: $event })"
                :readonly="!hasPermission"
            >
                <v-textarea v-model="modelValue.value" label="Description" :readonly="!hasPermission" />
            </InputWrapper>
        </DetailCompartment>
        <TemplatedFieldsDetailCompartment
            :templated-node="imsProject"
            :readonly="!hasPermission"
            :save="save"
            class="mt-4"
        />
    </div>
</template>
<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import InputWrapper from "@/components/input/InputWrapper.vue";
import TemplatedFieldsDetailCompartment from "@/components/TemplatedFieldsDetailCompartment.vue";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { UpdateImsProjectInput } from "@/gql/graphql";
import { eventBusKey } from "@/util/keys";
import { computedAsync } from "@vueuse/core";
import { computed, inject } from "vue";
import { useRoute } from "vue-router";
import { withErrorMessage } from "@/util/withErrorMessage";

const getIMSProjectGeneralDetailsQuery = graphql(`
    query getIMSProjectGeneralDetails($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IMSProject {
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
                ims {
                    syncTrackables: hasPermission(permission: SYNC_TRACKABLES)
                }
                trackable {
                    manageIMS: hasPermission(permission: MANAGE_IMS)
                }
            }
        }
    }
`);

const updateIMSProjectMutation = graphql(`
    mutation updateIMSProject($input: UpdateIMSProjectInput!) {
        updateIMSProject(input: $input) {
            imsProject {
                id
            }
        }
    }
`);

const route = useRoute();
const eventBus = inject(eventBusKey);
const imsProjectId = computed(() => route.params.project as string);

const imsProject = computedAsync(
    async () => {
        if (!imsProjectId.value) {
            return null;
        }

        return await withErrorMessage(
            () => queryNodeThrow(getIMSProjectGeneralDetailsQuery, "IMSProject", { id: imsProjectId.value }),
            "Error loading imsProject details"
        );
    },
    null,
    { shallow: false }
);

const hasPermission = computed(() => {
    const project = imsProject.value;
    if (project == undefined) {
        return false;
    }
    return project.ims?.syncTrackables && project.trackable.manageIMS;
});

async function save(input: Omit<UpdateImsProjectInput, "id">) {
    await withErrorMessage(
        () =>
            requestThrow(updateIMSProjectMutation, {
                input: {
                    id: imsProjectId.value,
                    ...input
                }
            }),
        "Error updating IMS project details"
    );
    if ("name" in input) {
        eventBus?.emit("title-segment-changed");
    }
}
</script>
