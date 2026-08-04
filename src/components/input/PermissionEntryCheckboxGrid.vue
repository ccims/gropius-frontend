<template>
    <div class="d-grid permission-container">
        <v-checkbox
            v-for="entry in permissionEntries"
            v-model="model[entry]"
            :key="entry"
            :label="enumToRegularCase(entry)"
            hide-details
        />
    </div>
</template>
<script setup lang="ts" generic="T extends string">
import { enumToRegularCase } from "@/util/casingTransformers";
import type { PropType } from "vue";

defineProps({
    permissionEntries: {
        type: Array as PropType<T[]>,
        required: true
    }
});

const model = defineModel({
    type: Object as PropType<Partial<Record<T, boolean>>>,
    required: true
});
</script>
<style scoped>
.permission-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    gap: 0 10px;
}
</style>
