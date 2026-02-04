<template>
    <v-dialog v-model="importComponentPermissionDialog" persistent width="auto">
        <ImportDialogContent
            item-name="component permission"
            confirmation-message="Import permission"
            :submit-disabled="submitDisabled"
            @cancel="importComponentPermissionDialog = false"
            @import="importComponentPermission($event as IdObject)"
        >
            <template #select="{ selectedItem }">
                <ExternalComponentPermissionAutocomplete
                    hide-details
                    autofocus
                    menu-mode="repeating"
                    :menu-delay="350"
                    @selected-item="selectedItem"
                />
            </template>
            <template #display="{ item }">
                <Permission :permission="<DefaultComponentPermissionInfoFragment>item" />
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
import ExternalComponentPermissionAutocomplete from "../input/ExternalComponentPermissionAutocomplete.vue";
import { DefaultComponentPermissionInfoFragment } from "@/gql/graphql";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import Permission from "../info/Permission.vue";
import { IdObject } from "@/util/types";

const addComponentPermissionToComponentMutation = graphql(`
    mutation addComponentPermissionToComponent($component: ID!, $componentPermission: ID!) {
        updateComponent(input: {
            id: $component
            addedPermissions: [$componentPermission]
        }) {
            __typename
        }
    }
`);

const importComponentPermissionDialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const emit = defineEmits<{
    (event: "imported-component-permission", componentPermission: IdObject): void;
}>();

const props = defineProps({
    component: {
        type: String,
        required: true
    }
});

onEvent("import-permission", () => {
    importComponentPermissionDialog.value = true;
});

async function importComponentPermission(componentPermission: IdObject) {
    blockWithErrorMessage(async () => {
        await requestThrow(addComponentPermissionToComponentMutation, {
            componentPermission: componentPermission.id,
            component: props.component
        });
        importComponentPermissionDialog.value = false;
        emit("imported-component-permission", componentPermission);
    }, "Error importing componentpermission");
}
</script>
