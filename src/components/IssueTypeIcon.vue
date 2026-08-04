<template>
    <svg viewBox="0 0 24 24">
        <path :d="path" :fill="fill" />
        <slot></slot>
    </svg>
</template>
<script setup lang="ts">
defineProps({
    path: {
        type: String,
        required: true
    },
    fill: {
        type: String,
        required: true
    }
});
</script>
