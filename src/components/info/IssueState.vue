<template>
    <v-chip :color="state.isOpen ? 'issue-open' : 'issue-closed'" rounded="pill">
        {{ state.name }}
        <v-tooltip activator="parent" location="bottom">
            {{ state.description }}
        </v-tooltip>
    </v-chip>
</template>
<script lang="ts" setup>
import { DefaultIssueStateInfoFragment } from "@/gql/graphql";
import { PropType } from "vue";

defineProps({
    state: {
        type: Object as PropType<DefaultIssueStateInfoFragment>,
        required: true
    }
});
</script>
