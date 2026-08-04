<template>
    <v-card
        variant="flat"
        color="surface-container-low"
        class="my-4"
        :class="{ 'opacity-60': props.editable === false }"
    >
        <div v-if="!isExpanded" class="d-flex align-center justify-space-between pa-2">
            <slot name="previewLeft" />

            <div class="d-flex align-center flex-grow-1 overflow-hidden">
                <v-list-item-title>{{ props.name }}</v-list-item-title>
            </div>

            <slot name="previewRight" />

            <div class="d-flex align-center flex-shrink-0 ms-2">
                <IconButton :disabled="!props.editable" @click="emit('expand')">
                    <v-icon>mdi-pencil</v-icon>
                </IconButton>
                <IconButton :disabled="!props.editable" @click="emit('delete')">
                    <v-icon>mdi-close</v-icon>
                </IconButton>
            </div>
        </div>

        <div v-else class="pa-3">
            <v-text-field
                class="mb-3"
                label="Name"
                v-model="localName"
                density="compact"
                :error="!!nameErrorMessage"
                :error-messages="nameErrorMessage"
            />
            <v-textarea
                v-if="props.description !== undefined"
                class="mb-3"
                label="Description"
                v-model="localDescription"
                auto-grow
                rows="1"
                max-rows="2"
                density="compact"
            />

            <slot name="extra" />

            <div class="d-flex justify-end ga-1 mt-3">
                <DefaultButton variant="text" color="" @click="emit('cancel')">Cancel</DefaultButton>
                <DefaultButton
                    variant="text"
                    @click="emit('confirm', { name: localName, description: localDescription })"
                >
                    Confirm
                </DefaultButton>
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

const props = withDefaults(
    defineProps<{
        name: string;
        description?: string;
        expandedCardKey: ExpandedKey;
        type: string;
        editable?: boolean;
    }>(),
    {
        editable: true
    }
);

const nameErrorMessage = defineModel<string>("nameErrorMessage", { default: "" });

const emit = defineEmits<{
    (e: "expand"): void;
    (e: "cancel"): void;
    (e: "confirm", payload: { name: string; description: string }): void;
    (e: "delete"): void;
}>();

const isExpanded = computed(
    () => props.editable && props.expandedCardKey?.type === props.type && props.expandedCardKey?.nameID === props.name
);

const localName = ref(props.name);
const localDescription = ref(props.description ?? "");

watch(localName, () => {
    nameErrorMessage.value = "";
});

watch(
    () => props.expandedCardKey,
    () => {
        if (isExpanded.value) {
            localName.value = props.name;
            localDescription.value = props.description ?? "";
        }
    }
);
</script>
