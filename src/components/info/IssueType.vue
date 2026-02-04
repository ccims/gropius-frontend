<template>
    <span class="type-wrapper">
        <IssueTypeIcon :path="type.iconPath" fill="rgb(var(--v-theme-primary))" class="inline-type-icon" />
        <span class="text-high-emphasis ml-1">{{ type.name }}</span>
        <v-tooltip activator="parent" location="bottom">
            {{ type.description }}
        </v-tooltip>
    </span>
</template>
<script setup lang="ts">
import { DefaultIssueTypeInfoFragment } from "@/gql/graphql";
import { PropType } from "vue";
import IssueTypeIcon from "../IssueTypeIcon.vue";

defineProps({
    type: {
        type: Object as PropType<DefaultIssueTypeInfoFragment>,
        required: true
    }
});
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.inline-type-icon {
    vertical-align: middle;
    display: inline;
    width: map.get(settings.$avatar-sizes, "large");
}

.type-wrapper {
    display: inline-block;
}
</style>
