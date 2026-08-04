<template>
    <DefaultIconTimelineItem icon="mdi-label" :item="item">
        added <Label v-if="item.addedLabel" :label="item.addedLabel!" /> <template v-else> a label </template>
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";
import Label from "../info/Label.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"AddedLabelEvent">>,
        required: true
    }
});
</script>
