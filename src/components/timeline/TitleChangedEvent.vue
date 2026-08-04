<template>
    <DefaultIconTimelineItem icon="mdi-pencil" :item="item">
        changed the title from <span class="text-decoration-line-through">{{ item.oldTitle }}</span> to
        <span>{{ item.newTitle }}</span>
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"TitleChangedEvent">>,
        required: true
    }
});
</script>
