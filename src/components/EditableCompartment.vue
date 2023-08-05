<template>
    <v-sheet
        v-click-outside="{
            handler: onClickOutside,
            closeConditional: () => !closeHierarchy
        }"
        class="ma-2 compartment-sheet"
        :class="{
            'px-4 py-2': editMode,
            'pl-2': !editMode
        }"
        :color="editMode ? 'surface-elevated-3' : 'surface-container'"
        rounded="xl"
        :elevation="editMode ? 5 : 0"
        ref="compartmentSheet"
    >
        <div class="d-flex align-center text-subtitle-2 title">
            {{ name }}
            <v-spacer />
            <IconButton v-if="editable && !editMode" @click="editMode = true">
                <v-icon>mdi-pencil</v-icon>
            </IconButton>
        </div>
        <div v-if="editMode" @click.stop="">
            <slot name="edit"></slot>
        </div>
        <div v-else>
            <slot name="display"></slot>
        </div>
        <v-overlay
            v-if="closeHierarchy"
            :model-value="editMode"
            @click:outside="onClickOutside"
            contained
            persistent
            :close-on-back="false"
            height="100%"
            width="100%"
            :scrim="false"
            :transition="undefined"
            class="pseudo-overlay"
        >
            <div class="pseudo-overlay-content"></div>
        </v-overlay>
        <ConfirmationDialog
            title="Discard changes"
            message="Discard unsaved changes?"
            :activator="undefined"
            ref="confirmationDialog"
            @confirm="closeEditMode"
        />
    </v-sheet>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ConfirmationDialog from "./dialog/ConfirmationDialog.vue";
import { VSheet } from "vuetify/lib/components/index.mjs";

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    saveButton: {
        type: Boolean,
        default: false
    },
    editable: {
        type: Boolean,
        required: true
    },
    hasUnsavedChanges: {
        type: Boolean,
        default: false
    },
    closeHierarchy: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits<{
    (event: "close"): void;
}>();

const editMode = ref(false);
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog>>();
const compartmentSheet = ref<VSheet>();

function onClickOutside(e: MouseEvent) {
    if (editMode.value) {
        if (compartmentSheet.value!.$el.contains(e.target as Node)) {
            return;
        }
        if (props.hasUnsavedChanges) {
            confirmationDialog.value!.dialog = true;
        } else {
            closeEditMode();
        }
    }
}

function closeEditMode() {
    editMode.value = false;
    emit("close");
}
</script>
<style scoped>
.title {
    height: 36px;
}

.compartment-sheet {
    position: relative;
}

.pseudo-overlay-content {
    width: 100%;
    height: 100%;
    background: none;
    pointer-events: none;
}

.pseudo-overlay :deep(*) {
    pointer-events: none;
}
</style>