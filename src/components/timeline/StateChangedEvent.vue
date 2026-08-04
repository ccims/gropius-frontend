<template>
    <DefaultIconTimelineItem icon="mdi-pencil" :item="item">
        changed the state from <IssueState :state="item.oldState" /> to <IssueState :state="item.newState" />
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";
import IssueState from "../info/IssueState.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"StateChangedEvent">>,
        required: true
    }
});
</script>
