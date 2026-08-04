<template>
    <v-btn-toggle class="segmented-button" multiple mandatory v-model="model">
        <v-btn class="issue-open" :prepend-icon="model.includes(0) ? 'mdi-check' : '$issue'"> Open </v-btn>
        <v-btn class="issue-closed" :prepend-icon="model.includes(1) ? 'mdi-check' : '$issue'"> Closed </v-btn>
    </v-btn-toggle>
</template>
<script setup lang="ts">
import type { PropType } from "vue";

const model = defineModel({
    type: Array as PropType<number[]>,
    required: true
});
</script>
<style scoped>
.issue-open :deep(.v-icon:not(.mdi-check)) {
    color: rgb(var(--v-theme-issue-open));
}

.issue-closed :deep(.v-icon:not(.mdi-check)) {
    color: rgb(var(--v-theme-issue-closed));
}
</style>
