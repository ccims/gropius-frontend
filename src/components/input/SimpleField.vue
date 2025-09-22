<template>
    <v-input :error-messages="errorMessages">
        <v-field
            :active="focused || !!modelValue"
            :focused="focused"
            :label="label"
            variant="outlined"
            color="primary"
            :error="errorMessages.length > 0"
            @focusin="focused = true"
            @focusout="focused = false"
        >
            <slot /> </v-field
    ></v-input>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue";

defineProps({
    modelValue: {
        type: String,
        required: false
    },
    label: {
        type: String,
        required: true
    },
    errorMessages: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    }
});

const focused = ref(false);
</script>
