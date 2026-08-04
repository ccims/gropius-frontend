<template>
    <custom-router-link :to="trackableLocation" :text="trackable.name" :tooltip="trackable.description" />
</template>
<script setup lang="ts">
import type { DefaultTrackableInfoFragment } from "@/gql/graphql";
import { computed } from "vue";
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";
import CustomRouterLink from "../CustomRouterLink.vue";

const props = defineProps({
    trackable: {
        type: Object as PropType<DefaultTrackableInfoFragment>,
        required: true
    }
});

const trackableLocation = computed<RouteLocationRaw>(() => {
    if (props.trackable.__typename === "Component") {
        return {
            name: "component",
            params: {
                trackable: props.trackable.id
            }
        };
    } else {
        return {
            name: "project",
            params: {
                trackable: props.trackable.id
            }
        };
    }
});
</script>
