<template>
    <DefaultIconTimelineItem icon="mdi-pencil" :item="item">
        changed the type from <IssueType :type="item.oldIssueType" /> to <IssueType :type="item.newIssueType" />
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";
import IssueType from "../info/IssueType.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"TypeChangedEvent">>,
        required: true
    }
});
</script>
