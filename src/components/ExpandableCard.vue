<template>
    <v-card variant="outlined" class="my-4">
        <div v-if="!isExpanded" class="d-flex align-center justify-space-between">
            <slot name="previewLeft" />

            <div class="d-flex align-center flex-grow-1 overflow-hidden">
                <div class="text-h6 font-weight-medium ma-2 text-truncate">
                    {{ props.name }}
                </div>
            </div>

            <slot name="previewRight" />

            <div class="d-flex align-center flex-shrink-0 ms-2">
                <IconButton @click="emit('expand')">
                    <v-icon>mdi-pencil</v-icon>
                </IconButton>
                <IconButton color="error" class="me-1" @click="emit('delete')">
                    <v-icon>mdi-delete</v-icon>
                </IconButton>
            </div>
        </div>

        <div v-else class="mt-2">
            <v-text-field
                class="mx-2 mb-2"
                label="Name"
                v-model="localName"
                density="compact"
                :error="!!props.nameErrorMessage"
                :error-messages="props.nameErrorMessage"
            />
            <v-textarea
                class="mx-2"
                label="Description"
                v-model="localDescription"
                auto-grow
                rows="1"
                max-rows="2"
                density="compact"
            />

            <slot name="extra" />

            <div class="d-flex justify-end ga-1">
                <v-btn class="mb-2" @click="emit('cancel')">Cancel</v-btn>
                <v-btn class="me-2" @click="emit('confirm', { name: localName, description: localDescription })">
                    Confirm
                </v-btn>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

type ExpandedKey = {
    nameID: string;
    type: string;
} | null;

const props = defineProps<{
    name: string;
    description: string;
    expandedCardKey: ExpandedKey;
    type: string;
    nameErrorMessage?: string;
}>();

const emit = defineEmits<{
    (e: "expand"): void;
    (e: "cancel"): void;
    (e: "confirm", payload: { name: string; description: string }): void;
    (e: "delete"): void;
}>();

const isExpanded = computed(
    () => props.expandedCardKey?.type === props.type && props.expandedCardKey?.nameID === props.name
);

const localName = ref(props.name);
const localDescription = ref(props.description);

watch(
    () => props.expandedCardKey,
    () => {
        if (isExpanded.value) {
            localName.value = props.name;
            localDescription.value = props.description;
        }
    }
);
</script>
