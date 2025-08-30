<!-- components/SvgIcon.vue -->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    fill="currentColor"
    class="svg-icon"
    :width="size"
    :height="size"
    aria-hidden="true"
  >
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  path: string;
  viewBox?: string;
  size?: number | string;
}>();
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
