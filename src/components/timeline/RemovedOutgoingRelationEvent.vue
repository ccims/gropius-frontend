<template>
    <DefaultIconTimelineItem icon="mdi-delete" :item="item">
        removed an <span class="text-high-emphasis">outgoing relation</span>
        <template v-if="item.removedRelation?.type"> with type <Type :type="item.removedRelation.type" /> </template>
        <template v-if="item.removedRelation?.relatedIssue" #content>
            <Issue :issue="item.removedRelation.relatedIssue" />
        </template>
    </DefaultIconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import DefaultIconTimelineItem from "./DefaultIconTimelineItem.vue";
import Issue from "../info/Issue.vue";
import Type from "../info/Type.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<"RemovedOutgoingRelationEvent">>,
        required: true
    }
});
</script>
