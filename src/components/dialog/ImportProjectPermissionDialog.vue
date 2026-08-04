<template>
    <v-dialog v-model="importProjectPermissionDialog" persistent width="auto">
        <ImportDialogContent
            item-name="project permission"
            confirmation-message="Import permission"
            :submit-disabled="submitDisabled"
            @cancel="importProjectPermissionDialog = false"
            @import="importProjectPermission($event as IdObject)"
        >
            <template #select="{ selectedItem }">
                <ExternalProjectPermissionAutocomplete
                    hide-details
                    autofocus
                    menu-mode="repeating"
                    :menu-delay="350"
                    @selected-item="selectedItem"
                />
            </template>
            <template #display="{ item }">
                <Permission :permission="<DefaultProjectPermissionInfoFragment>item" />
            </template>
        </ImportDialogContent>
    </v-dialog>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { onEvent } from "@/util/eventBus";
import { ref } from "vue";
import ImportDialogContent from "./ImportDialogContent.vue";
import ExternalProjectPermissionAutocomplete from "../input/ExternalProjectPermissionAutocomplete.vue";
import type { DefaultProjectPermissionInfoFragment } from "@/gql/graphql";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import Permission from "../info/Permission.vue";
import type { IdObject } from "@/util/types";

const addProjectPermissionToProjectMutation = graphql(`
    mutation addProjectPermissionToProject($project: ID!, $projectPermission: ID!) {
        updateProject(input: { id: $project, addedPermissions: [$projectPermission] }) {
            __typename
        }
    }
`);

const importProjectPermissionDialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "imported-project-permission", projectPermission: IdObject): void;
}>();

const props = defineProps({
    project: {
        type: String,
        required: true
    }
});

onEvent("import-permission", () => {
    importProjectPermissionDialog.value = true;
});

async function importProjectPermission(projectPermission: IdObject) {
    blockWithErrorMessage(async () => {
        await requestThrow(addProjectPermissionToProjectMutation, {
            projectPermission: projectPermission.id,
            project: props.project
        });
        importProjectPermissionDialog.value = false;
        emit("imported-project-permission", projectPermission);
    }, "Error importing projectpermission");
}
</script>
