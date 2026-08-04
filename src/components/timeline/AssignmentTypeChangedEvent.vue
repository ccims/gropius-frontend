<template>
    <DefaultIconTimelineItem icon="mdi-pencil" :item="item">
        updated the assignment of <User :user="item.assignment.user" /> from
        <Type :type="item.oldAssignmentType ?? undefined" /> to <Type :type="item.newAssignmentType ?? undefined" />
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
        type: Object as PropType<TimelineItemType<"AssignmentTypeChangedEvent">>,
        required: true
    }
});
</script>
