<script setup lang="ts">
import { PropType } from "vue";
import BaseLayout, { TabSegment, TitleSegment } from "@/components/BaseLayout.vue";
import { SideBarItem } from "@/components/SideBar.vue";

const props = defineProps({
    titleSegments: {
        type: Array as PropType<TitleSegment[]>,
        default: () => [{ name: "Gropius", path: "/" }]
    },
    tabs: {
        type: Array as PropType<TabSegment[]>,
        default: () => []
    },
    leftSidebarItems: {
        type: Array as PropType<SideBarItem[][]>,
        default: () => []
    },
    rightSidebarItems: {
        type: Array as PropType<SideBarItem[][]>,
        default: () => []
    },
    dataPresent: {
        type: Boolean
    },
    evaluating: {
        type: Boolean
    }
});
</script>

<template>
    <BaseLayout
        v-if="dataPresent"
        :title-segments="titleSegments"
        :tabs="tabs"
        :right-sidebar-items="rightSidebarItems"
        :left-sidebar-items="leftSidebarItems"
    >
        <template #content>
            <slot name="content"></slot>
        </template>
    </BaseLayout>
    <h1 v-else-if="!evaluating">Not found</h1>
</template>

<style scoped lang="scss"></style>
