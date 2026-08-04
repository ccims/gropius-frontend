<template>
    <router-link :to="to" class="custom-link">
        {{ text }}
        <v-tooltip v-if="tooltip" location="top" activator="parent">
            {{ tooltip }}
        </v-tooltip>
    </router-link>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

defineProps({
    to: {
        type: Object as PropType<RouteLocationRaw>,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    tooltip: {
        type: String,
        required: false
    }
});
</script>
<style scoped>
.custom-link {
    text-decoration: none;
}
.custom-link:hover {
    color: rgb(var(--v-theme-primary)) !important;
}
</style>
