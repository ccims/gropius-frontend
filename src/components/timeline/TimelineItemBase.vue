<template>
    <div class="timeline-item">
        <div class="content">
            <slot />
        </div>
        <div class="timeline" />
    </div>
</template>
<script setup lang="ts">
import { DefaultTimelineItemInfoFragment } from "@/gql/graphql";

export type TimelineItemType<T extends string> = DefaultTimelineItemInfoFragment & { __typename: T };
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";

.timeline {
    position: absolute;
    margin-left: calc(settings.$timeline-offset - 1px);
    border-left: 2px solid currentColor;
    color: rgb(var(--v-theme-outline-variant));
    top: 0;
    bottom: 0;
}
.timeline-item {
    position: relative;
    box-sizing: border-box;
    height: fit-content;
    overflow: hidden;
}
.content {
    position: relative;
    z-index: 1;
}
</style>
