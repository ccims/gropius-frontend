<template>
    <DefaultIconTimelineItem icon="mdi-lightning-bolt" :item="item">
        unaffected <AffectedByIssue v-if="item.removedAffectedEntity" :affected-entity="item.removedAffectedEntity!" />
        <template v-else> an entity </template>
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";
import AffectedByIssue from "../info/AffectedByIssue.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"RemovedAffectedEntityEvent">>,
        required: true
    }
});
</script>
