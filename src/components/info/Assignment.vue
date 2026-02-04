<template>
    <span class="assignment-wrapper">
        <User :user="assignment.user" />
        <span v-if="assignment.type">
            ({{ assignment.type.name }})
            <v-tooltip location="bottom" activator="parent">
                <span>{{ assignment.type.description }}</span>
            </v-tooltip>
        </span>
    </span>
</template>
<script setup lang="ts">
import { DefaultAssignmentInfoFragment } from "@/gql/graphql";
import { PropType } from "vue";
import User from "./User.vue";

defineProps({
    assignment: {
        type: Object as PropType<DefaultAssignmentInfoFragment>,
        required: true
    }
});
</script>
<style scoped>
.assignment-wrapper {
    display: inline-block;
}
</style>
