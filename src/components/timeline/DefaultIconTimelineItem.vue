<template>
    <IconTimelineItem :icon="icon">
        <div class="text-medium-emphasis content-wrapper">
            <User :user="item.createdBy" /> <slot /> <RelativeTimeWrapper :time="item.createdAt" />
        </div>
        <template #content>
            <slot name="content" />
        </template>
    </IconTimelineItem>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import IconTimelineItem from "./IconTimelineItem.vue";
import User from "@/components/info/User.vue";
import type { TimelineItemType } from "./TimelineItemBase.vue";
import RelativeTimeWrapper from "../RelativeTimeWrapper.vue";

defineProps({
    item: {
        type: Object as PropType<TimelineItemType<any>>,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});
</script>
<style scoped>
.content-wrapper {
    line-height: 2;
}
</style>
