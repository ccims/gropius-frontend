<template>
    <v-card
        variant="flat"
        color="surface-container-low"
        class="my-4"
        :class="{ 'opacity-60': props.editable === false }"
    >
        <div v-if="!isExpanded">
            <div class="d-flex align-center justify-space-between pa-2">
                <slot name="previewLeft" />

                <div class="d-flex align-center flex-grow-1 overflow-hidden">
                    <v-list-item-title>{{ props.name }}</v-list-item-title>
                </div>

                <slot name="previewRight" />

                <div class="d-flex align-center flex-shrink-0 ms-2">
                    <!--
                        The details are readable without opening the editor, which the card may not
                        even allow. No tooltip on purpose: a dialog holds dozens of these cards and
                        every tooltip is an overlay that has to be built while hovering over them.
                    -->
                    <IconButton
                        v-if="hasDetails"
                        :aria-label="detailsOpen ? 'Hide details' : 'Show details'"
                        @click="detailsOpen = !detailsOpen"
                    >
                        <v-icon>{{ detailsOpen ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                    </IconButton>
                    <!-- entries that cannot be changed, like inherited ones, only offer their details -->
                    <IconButton v-if="props.editable" @click="emit('expand')">
                        <v-icon>mdi-pencil</v-icon>
                    </IconButton>
                    <IconButton v-if="props.editable" @click="emit('delete')">
                        <v-icon>mdi-close</v-icon>
                    </IconButton>
                </div>
            </div>
            <Transition name="details">
                <div v-if="detailsOpen" class="details px-3 pb-3">
                    <div v-if="props.description" class="text-body-2 text-medium-emphasis mb-2">
                        {{ props.description }}
                    </div>
                    <slot name="details" />
                </div>
            </Transition>
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
import { ref, computed, watch, useSlots } from "vue";

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

const slots = useSlots();
const detailsOpen = ref(false);
const hasDetails = computed(() => !!props.description || slots.details != undefined);

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

<style scoped>
/*
 * The card takes its full height in one go and only the details fade and slide in. Opacity and
 * transform are compositor properties, so nothing is laid out again while the animation runs, which
 * an animated height would do for the whole dialog on every frame.
 */
.details-enter-active {
    transition:
        opacity 0.15s ease,
        transform 0.15s ease;
    will-change: opacity, transform;
}

.details-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

/*
 * Closing is not animated: the space can only be freed once the element is gone, so a fade out would
 * hold the space open and then let everything below jump at the very end.
 */

/* keeps the layout of the details to themselves, so opening one card does not reflow the others */
.details {
    contain: layout;
}
</style>
