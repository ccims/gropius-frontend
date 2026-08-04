<template>
    <DefaultIconTimelineItem icon="mdi-pencil" :item="item">
        changed the priority from <IssuePriority :priority="item.oldPriority ?? undefined" /> to
        <IssuePriority :priority="item.newPriority ?? undefined" />
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";
import IssuePriority from "../info/IssuePriority.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"PriorityChangedEvent">>,
        required: true
    }
});
</script>
