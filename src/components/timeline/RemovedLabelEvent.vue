<template>
    <DefaultIconTimelineItem icon="mdi-label" :item="item">
        removed <Label v-if="item.removedLabel" :label="item.removedLabel!" />
        <template v-else> a label </template>
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";
import Label from "../info/Label.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"RemovedLabelEvent">>,
        required: true
    }
});
</script>
