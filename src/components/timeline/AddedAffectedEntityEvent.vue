<template>
    <DefaultIconTimelineItem icon="mdi-lightning-bolt" :item="item">
        affected <AffectedByIssue v-if="item.addedAffectedEntity" :affected-entity="item.addedAffectedEntity!" />
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
        type: Object as PropType<TimelineItemType<"AddedAffectedEntityEvent">>,
        required: true
    }
});
</script>
