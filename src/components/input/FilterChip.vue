<template>
    <v-chip
        :color="model ? 'primary' : undefined"
        :variant="model ? 'tonal' : 'outlined'"
        :prepend-icon="prependIcon"
        rounded="lg"
        class="filter-chip"
        @click="model = !model"
        >{{ label }}</v-chip
    >
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false
    }
});

const model = defineModel({
    type: Boolean,
    required: true
});

const prependIcon = computed(() => (model.value ? "mdi-check" : props.icon));
</script>
<style scoped>
.filter-chip {
    user-select: none;
}
</style>
