<template>
    <div
        class="board-column d-flex flex-column"
        :class="{ 'board-column--temporary': temporary, 'board-column--dragging': dragging }"
        @dragover="onDragOver"
        @drop="onDrop"
        @dragleave="onDragLeave"
    >
        <div
            class="column-header d-flex align-center pl-4 pr-2 py-2 flex-0-0"
            :draggable="canManage && !temporary"
            @dragstart="$emit('column-drag-start', $event.dataTransfer)"
            @dragend="$emit('column-drag-end')"
        >
            <div class="text-subtitle-1 text-truncate">
                {{ name }}
                <v-tooltip v-if="description" activator="parent" location="bottom">{{ description }}</v-tooltip>
            </div>
            <div class="text-medium-emphasis text-body-2 ml-2 flex-0-0">{{ items.length }}</div>
            <v-spacer />
            <IconButton v-if="!temporary" density="comfortable" :disabled="!canManage">
                <v-icon icon="mdi-dots-vertical" />
                <v-menu activator="parent" location="bottom end">
                    <v-list rounded="lger" class="pa-2" bg-color="surface-elevated-3">
                        <v-list-item title="Edit column" prepend-icon="mdi-pencil" @click="$emit('edit')" />
                        <v-list-item title="Delete column" prepend-icon="mdi-delete" @click="deleteDialog = true" />
                    </v-list>
                </v-menu>
            </IconButton>
            <v-tooltip v-else location="bottom">
                <template #activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-help-circle-outline" class="mr-2 text-medium-emphasis" />
                </template>
                Issues whose state is not assigned to any column of this board
            </v-tooltip>
        </div>
        <div ref="body" class="column-body flex-1-1 overflow-y-auto px-2 pb-2">
            <template v-for="(item, index) in items" :key="item.id">
                <div v-if="cardDropIndex == index" class="drop-indicator" />
                <div class="card-container">
                    <IssueBoardCard
                        :issue="item.issue"
                        :draggable="canMoveItems"
                        :dragging="draggedItemId == item.id"
                        :can-remove="canMoveItems"
                        @drag-start="$emit('card-drag-start', item, $event)"
                        @drag-end="$emit('card-drag-end')"
                        @remove="$emit('remove-item', item)"
                        @open="$emit('open-issue', item)"
                    />
                </div>
            </template>
            <div v-if="cardDropIndex == items.length" class="drop-indicator" />
            <div v-if="items.length == 0 && cardDropIndex == undefined" class="text-medium-emphasis text-body-2 pa-2">
                No issues
            </div>
        </div>
        <!-- ConfirmationDialog uses its parent as activator, so it is wrapped to keep the column itself from opening it -->
        <div class="d-none">
            <ConfirmationDialog
                v-model="deleteDialog"
                :title="`Delete column ${name}?`"
                message="Are you sure you want to delete this column? The issues in it are not deleted, they are only no longer shown in this column."
                confirm-text="Delete"
                @confirm="$emit('delete')"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import type { IssueBoardItemInfoFragment } from "@/gql/graphql";
import { ref, useTemplateRef, type PropType } from "vue";
import IssueBoardCard from "./IssueBoardCard.vue";
import ConfirmationDialog from "../dialog/ConfirmationDialog.vue";
import type { BoardDragState } from "./boardDrag";

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    items: {
        type: Array as PropType<IssueBoardItemInfoFragment[]>,
        required: true
    },
    /**
     * If true, this is the generated column for issues without a matching state,
     * which is rendered outlined and cannot be modified or dropped into.
     */
    temporary: {
        type: Boolean,
        default: false
    },
    canManage: {
        type: Boolean,
        default: false
    },
    canMoveItems: {
        type: Boolean,
        default: false
    },
    dragState: {
        type: Object as PropType<BoardDragState | undefined>,
        required: false
    },
    dragging: {
        type: Boolean,
        default: false
    },
    draggedItemId: {
        type: String,
        required: false
    }
});

const emit = defineEmits<{
    (event: "edit"): void;
    (event: "delete"): void;
    (event: "remove-item", item: IssueBoardItemInfoFragment): void;
    (event: "open-issue", item: IssueBoardItemInfoFragment): void;
    (event: "card-drag-start", item: IssueBoardItemInfoFragment, dataTransfer: DataTransfer | null): void;
    (event: "card-drag-end"): void;
    (event: "column-drag-start", dataTransfer: DataTransfer | null): void;
    (event: "column-drag-end"): void;
    (event: "drop-card", index: number): void;
    (event: "column-drag-over", before: boolean): void;
    (event: "drop-column"): void;
}>();

const deleteDialog = ref(false);
const cardDropIndex = ref<number | undefined>(undefined);
const body = useTemplateRef("body");

/**
 * Computes the index at which a dragged card would be inserted, based on the pointer position
 * relative to the vertical center of the already present cards.
 */
function computeCardDropIndex(event: DragEvent): number {
    const cards = Array.from(body.value?.querySelectorAll(".card-container") ?? []);
    for (let index = 0; index < cards.length; index++) {
        const rect = cards[index].getBoundingClientRect();
        if (event.clientY < rect.top + rect.height / 2) {
            return index;
        }
    }
    return cards.length;
}

function onDragOver(event: DragEvent) {
    const dragState = props.dragState;
    if (dragState == undefined) {
        return;
    }
    if (dragState.kind == "column") {
        if (props.temporary || !props.canManage) {
            return;
        }
        event.preventDefault();
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        emit("column-drag-over", event.clientX < rect.left + rect.width / 2);
    } else {
        if (props.temporary || !props.canMoveItems) {
            return;
        }
        event.preventDefault();
        cardDropIndex.value = computeCardDropIndex(event);
    }
}

function onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target.contains(event.relatedTarget as Node | null)) {
        cardDropIndex.value = undefined;
    }
}

function onDrop(event: DragEvent) {
    const dragState = props.dragState;
    if (dragState == undefined) {
        return;
    }
    event.preventDefault();
    if (dragState.kind == "column") {
        emit("drop-column");
    } else if (cardDropIndex.value != undefined) {
        emit("drop-card", cardDropIndex.value);
    }
    cardDropIndex.value = undefined;
}
</script>
<style scoped lang="scss">
.board-column {
    // fixed width, so that the board scrolls horizontally instead of squeezing the columns
    flex: 0 0 320px;
    background: rgb(var(--v-theme-surface-container));
    border-radius: 16px;

    &--temporary {
        background: transparent;
        border: 1px solid rgb(var(--v-theme-outline));
    }

    &--dragging {
        opacity: 0.4;
    }
}

.column-header[draggable="true"] {
    cursor: grab;
}

.card-container {
    padding-bottom: 8px;
}

.drop-indicator {
    height: 2px;
    margin: 3px 0 7px 0;
    border-radius: 1px;
    background: rgb(var(--v-theme-primary));
}
</style>
