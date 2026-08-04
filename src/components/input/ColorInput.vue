<template>
    <v-text-field
        :model-value="model"
        @update:model-value="model = $event ?? ''"
        :label="label"
        :error-messages="errorMessage"
        :readonly="readonly"
        :clearable="!readonly"
    >
        <template #append-inner v-if="isValid">
            <v-icon :color="model" icon="mdi-circle" class="opacity-100" />
        </template>
        <v-menu v-if="!readonly" activator="parent" :close-on-content-click="false">
            <v-color-picker class="mt-1" rounded="lger" v-model="pickerColor" :modes="['rgb']" />
        </v-menu>
    </v-text-field>
</template>

<script lang="ts" setup>
import { fallbackColor } from "@/util/fallbackColor";
import { computed } from "vue";

/** An empty value means that no color is set */
const model = defineModel({ type: String, required: true });

defineProps({
    label: {
        type: String,
        required: true
    },
    readonly: {
        type: Boolean,
        required: false,
        default: false
    }
});

const isValid = computed(() => /^#[0-9a-f]{6}$/i.test(model.value));

const errorMessage = computed(() => (!model.value || isValid.value ? "" : "Is not a valid hex color code #RRGGBB"));

const pickerColor = computed({
    get: () => fallbackColor(model.value),
    set: (value: string) => {
        model.value = value;
    }
});
</script>
