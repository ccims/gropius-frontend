<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="project != undefined">
        <DetailCompartment name="General">
            <InputWrapper
                v-model="project.name"
                v-slot="{ modelValue }"
                @save="save({ name: $event })"
                :readonly="!project.admin"
            >
                <v-text-field v-model="modelValue.value" label="Name" :readonly="!project.admin" />
            </InputWrapper>
            <InputWrapper
                v-model="project.description"
                v-slot="{ modelValue }"
                @save="save({ description: $event })"
                :readonly="!project.admin"
            >
                <v-textarea v-model="modelValue.value" label="Description" :readonly="!project.admin" />
            </InputWrapper>
            <InputWrapper
                v-model="project.repositoryURL"
                v-slot="{ modelValue }"
                @save="save({ repositoryURL: $event })"
                :readonly="!project.admin"
            >
                <v-text-field v-model="modelValue.value" label="Repository URL" :readonly="!project.admin" />
            </InputWrapper>
            <InputWrapper
                v-model="defaultView"
                v-slot="{ modelValue }"
                @save="save({ defaultView: $event ?? null })"
                :readonly="!project.admin"
            >
                <ViewAutocomplete
                    v-model="modelValue.value"
                    :project="project.id"
                    label="Default View"
                    :readonly="!project.admin"
                    clearable
                    persistent-clear
                />
            </InputWrapper>
        </DetailCompartment>
    </div>
</template>
<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import InputWrapper from "@/components/input/InputWrapper.vue";
import ViewAutocomplete from "@/components/input/ViewAutocomplete.vue";
import { UpdateProjectInput } from "@/gql/graphql";
import { eventBusKey } from "@/util/keys";
import { computedAsync } from "@vueuse/core";
import { computed, inject } from "vue";
import { useRoute } from "vue-router";
import { graphql } from "@/gql";
import { queryNodeThrow, request } from "@/gql/client";
import { withErrorMessage } from "@/util/withErrorMessage";

const getProjectGeneralDetailsQuery = graphql(`
    query getProjectGeneralDetails($id: ID!) {
        node(id: $id) {
            id
            ... on Project {
                name
                description
                repositoryURL
                defaultView {
                    id
                }
                admin: hasPermission(permission: ADMIN)
            }
        }
    }
`);

const updateProjectMutation = graphql(`
    mutation updateProject($input: UpdateProjectInput!) {
        updateProject(input: $input) {
            project {
                id
            }
        }
    }
`);

const route = useRoute();
const eventBus = inject(eventBusKey);
const projectId = computed(() => route.params.trackable as string);

const project = computedAsync(
    async () => {
        if (!projectId.value) {
            return null;
        }
        return await withErrorMessage(
            () => queryNodeThrow(getProjectGeneralDetailsQuery, "Project", { id: projectId.value }),
            "Error loading project details"
        );
    },
    null,
    { shallow: false }
);

const defaultView = computed({
    get: () => project.value?.defaultView?.id,
    set: (value: string | undefined) => {
        const projectValue = project.value;
        if (projectValue != undefined) {
            if (value == undefined) {
                projectValue.defaultView = null;
            } else {
                projectValue.defaultView = { id: value };
            }
        }
    }
});

async function save(input: Omit<UpdateProjectInput, "id">) {
    await withErrorMessage(
        () =>
            request(updateProjectMutation, {
                input: {
                    id: projectId.value,
                    ...input
                }
            }),
        "Error updating project details"
    );
    if ("name" in input) {
        eventBus?.emit("title-segment-changed");
    }
}
</script>
