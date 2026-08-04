<template>
    <DefaultIconTimelineItem icon="mdi-delete" :item="item">
        unassigned <User :user="item.removedAssignment.user" />
        <template v-if="item.removedAssignment.type">as <Type :type="item.removedAssignment.type" /></template>
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";
import Type from "../info/Type.vue";
import User from "@/components/info/User.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"RemovedAssignmentEvent">>,
        required: true
    }
});
</script>
