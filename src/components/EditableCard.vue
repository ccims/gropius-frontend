<template>
    <v-card :variant="props.variant ?? 'outlined'" :color="props.color" class="my-2 me-10">
        <div v-if="!editMode" class="d-flex align-center justify-space-between">
            <div class="d-flex align-center flex-grow-1 overflow-hidden">
                <v-icon v-if="props.prependIcon" class="ms-2" size="small">{{ props.prependIcon }}</v-icon>
                <div class="text-h8 font-weight-medium mx-2 text-truncate">
                    {{ props.content }}
                </div>
            </div>
            <div class="d-flex align-center flex-shrink-0 ms-2">
                <IconButton v-if="props.editable" @click="toggleEditMode">
                    <v-icon>mdi-pencil</v-icon>
                </IconButton>
                <IconButton color="error" class="me-1" @click="emit('delete')">
                    <v-icon>mdi-delete</v-icon>
                </IconButton>
            </div>
        </div>
        <div v-else class="d-flex align-center">
            <v-text-field v-model="localContent" class="ma-2" hide-details density="compact" />
            <div class="d-flex justify-end">
                <v-btn
                    v-if="props.editable"
                    class="me-1"
                    @click="
                        () => {
                            toggleEditMode();
                            localContent = props.content;
                        }
                    "
                    >Cancel</v-btn
                >
                <v-btn
                    class="mx-1"
                    @click="
                        () => {
                            emit('confirm', { content: localContent });
                            toggleEditMode();
                        }
                    "
                    >Confirm</v-btn
                >
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
    defineProps<{
        content: string;
        color?: string;
        editable?: boolean;
        variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
        prependIcon?: string;
    }>(),
    {
        editable: true,
    }
);

const emit = defineEmits<{
    (e: "delete"): void;
    (e: "confirm", payload: { content: string }): void;
}>();

const editMode = ref(false);
const localContent = ref<string>(props.content);

watch(
    () => props.content,
    (newContent) => {
        localContent.value = newContent;
    }
);

function toggleEditMode() {
    editMode.value = !editMode.value;
}
</script>
