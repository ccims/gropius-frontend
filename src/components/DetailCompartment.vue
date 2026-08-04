<template>
    <v-sheet class="pa-4" rounded="lger" :elevation="0" :color="color">
        <div class="text-h6 mb-4">{{ name }}</div>
        <slot />
    </v-sheet>
</template>
<script lang="ts" setup>
defineProps({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false,
        default: "surface-container-low"
    }
});
</script>
