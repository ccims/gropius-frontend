<template>
    <v-card
        class="board-card pa-3"
        variant="outlined"
        rounded="lger"
        :draggable="draggable"
        :class="{ dragging }"
        @dragstart="onDragStart"
        @dragend="$emit('drag-end')"
        @click="$emit('open')"
    >
        <div class="d-flex align-center mb-2 ga-1">
            <IssueIcon :issue="issue" class="issue-icon flex-0-0" />
            <v-icon v-if="issue.priority != undefined" class="priority-icon" :icon="priorityIcon" size="small">
                <v-tooltip activator="parent" location="bottom">{{ issue.priority.name }}</v-tooltip>
            </v-icon>
            <v-spacer />
            <UserStack
                v-if="assignees.length > 0"
                :users="assignees"
                size="small"
                class="assignee-stack flex-0-0 mr-1"
            />
            <IconButton
                v-if="canRemove"
                class="card-menu flex-0-0"
                density="compact"
                @click.stop
                @dragstart.stop.prevent
            >
                <v-icon icon="mdi-dots-horizontal" size="small" />
                <v-menu activator="parent" location="bottom end">
                    <v-list rounded="lger" class="pa-2" bg-color="surface-elevated-3">
                        <v-list-item
                            title="Remove from board"
                            prepend-icon="mdi-close"
                            @click.stop="removeDialog = true"
                        />
                    </v-list>
                </v-menu>
            </IconButton>
        </div>
        <div class="text-body-2 card-title">{{ issue.title }}</div>
        <div v-if="issue.labels.nodes.length > 0" class="d-flex flex-wrap ga-1 mt-2">
            <Label v-for="label in issue.labels.nodes" :key="label.id" :label="label" size="x-small" />
        </div>
        <!-- ConfirmationDialog uses its parent as activator, so it is wrapped to keep the card itself from opening it -->
        <div class="d-none">
            <ConfirmationDialog
                v-model="removeDialog"
                title="Remove issue from board?"
                message="Are you sure you want to remove this issue from the Issue Board? The issue itself is not deleted."
                confirm-text="Remove"
                @confirm="$emit('remove')"
            />
        </div>
    </v-card>
</template>
<script setup lang="ts">
import type { IssueBoardCardInfoFragment } from "@/gql/graphql";
import { computed, ref, type PropType } from "vue";
import IssueIcon from "../IssueIcon.vue";
import UserStack from "../UserStack.vue";
import Label from "../info/Label.vue";
import ConfirmationDialog from "../dialog/ConfirmationDialog.vue";
import { issuePriorityIcon } from "@/util/issuePriorityIcon";

const props = defineProps({
    issue: {
        type: Object as PropType<IssueBoardCardInfoFragment>,
        required: true
    },
    draggable: {
        type: Boolean,
        default: false
    },
    dragging: {
        type: Boolean,
        default: false
    },
    canRemove: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits<{
    (event: "drag-start", dataTransfer: DataTransfer | null): void;
    (event: "drag-end"): void;
    (event: "remove"): void;
    (event: "open"): void;
}>();

const removeDialog = ref(false);

const assignees = computed(() => props.issue.assignments.nodes.map((assignment) => assignment.user));
const priorityIcon = computed(() => issuePriorityIcon(props.issue.priority?.value ?? 0));

function onDragStart(event: DragEvent) {
    emit("drag-start", event.dataTransfer);
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.board-card {
    background: rgb(var(--v-theme-surface));
    border-color: rgb(var(--v-theme-outline-variant));
    cursor: pointer;

    &.dragging {
        opacity: 0.4;
    }

    .card-menu {
        opacity: 0;
        transition: opacity 150ms;
    }

    &:hover .card-menu,
    .card-menu:focus-within {
        opacity: 1;
    }
}

.issue-icon {
    width: map.get(settings.$avatar-sizes, "large");
    height: map.get(settings.$avatar-sizes, "large");
}

.priority-icon {
    // the app disables Vuetify's color pack, so the theme color has to be applied directly
    color: rgb(var(--v-theme-primary));
}

.card-title {
    overflow-wrap: anywhere;
}

.assignee-stack {
    background: transparent;
}
</style>
