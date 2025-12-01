<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path :d="normalizedPath" />
    </svg>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{ path: string }>();

const normalizedPath = computed(() => props.path.trim().replace(/"/g, ""));
</script>
