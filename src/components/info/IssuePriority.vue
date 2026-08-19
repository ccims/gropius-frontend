<template>
    <v-chip v-if="priority != undefined" color="primary" rounded="pill">
        <template v-if="priority.iconPath" #prepend>
            <SvgWrapper :path="priority.iconPath" class="priority-icon mr-1" />
        </template>
        {{ priority.name }}
        <v-tooltip activator="parent" location="bottom">
            {{ priority.description }}
        </v-tooltip>
    </v-chip>
    <span v-else class="priority-wrapper text-high-emphasis ml-1">No priority</span>
</template>
<script setup lang="ts">
import type { DefaultIssuePriorityInfoFragment } from "@/gql/graphql";
import type { PropType } from "vue";
import SvgWrapper from "../SvgWrapper.vue";

defineProps({
    priority: {
        type: Object as PropType<DefaultIssuePriorityInfoFragment>,
        required: false
    }
});
</script>
<style scoped>
.priority-wrapper {
    display: inline-block;
}

.priority-icon {
    width: 1.25em;
    height: 1.25em;
}
</style>
