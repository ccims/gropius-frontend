<template>
    <div class="d-flex flex-column h-100">
        <div v-if="board == undefined" class="text-medium-emphasis pa-4">
            {{ evaluating ? "Loading issue board..." : "Issue board not found" }}
        </div>
        <template v-else>
            <!-- the padding sits on the wrapper, so the gutter around the board stays put while scrolling -->
            <div class="board-container flex-1-1 pa-3">
                <div class="board-scroll-container d-flex ga-3" @dragover.prevent @drop="onContainerDrop">
                    <template v-for="(column, index) in displayedColumns" :key="column.id ?? 'no-matching-state'">
                        <div v-if="columnDropIndex == index" class="column-drop-indicator" />
                        <IssueBoardColumn
                            :name="column.name"
                            :description="column.description"
                            :items="column.items"
                            :temporary="column.temporary"
                            :can-manage="canManageBoard"
                            :can-move-items="canManageIssues"
                            :drag-state="dragState"
                            :dragging="dragState?.kind == 'column' && dragState.columnId == column.id"
                            :dragged-item-id="dragState?.kind == 'card' ? dragState.item.id : undefined"
                            @edit="editColumn(column)"
                            @delete="deleteColumn(column.id!)"
                            @remove-item="removeItem($event)"
                            @open-issue="openIssue($event)"
                            @card-drag-start="(item, dataTransfer) => startCardDrag(item, column.id, dataTransfer)"
                            @card-drag-end="endDrag"
                            @column-drag-start="startColumnDrag(column.id!, $event)"
                            @column-drag-end="endDrag"
                            @drop-card="dropCard(column, $event)"
                            @column-drag-over="columnDropIndex = $event ? index : index + 1"
                            @drop-column="dropColumn"
                        />
                    </template>
                    <div v-if="columnDropIndex == displayedColumns.length" class="column-drop-indicator" />
                    <div v-if="displayedColumns.length == 0" class="text-medium-emphasis pa-2">
                        This issue board has no columns yet.
                    </div>
                </div>
            </div>
        </template>
        <CreateIssueBoardColumnDialog
            :issue-board="boardId"
            :next-position="nextColumnPosition"
            @created-issue-board-column="reload()"
        />
        <UpdateIssueBoardColumnDialog v-model="columnToUpdate" @updated-issue-board-column="reload()" />
        <AddIssueToBoardDialog
            :trackable="trackableId"
            :issue-board="boardId"
            :next-position="nextItemPosition"
            :ignore="issuesOnBoard"
            @added-issue="reload()"
        />
        <SelectIssueStateDialog v-model="stateSelection" @selected="finishPendingDrop" @cancel="pendingDrop = null" />
    </div>
</template>
<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import { computed, inject, ref, shallowRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { withErrorMessage } from "@/util/withErrorMessage";
import { trackableKey } from "@/util/keys";
import IssueBoardColumn from "@/components/board/IssueBoardColumn.vue";
import CreateIssueBoardColumnDialog from "@/components/dialog/CreateIssueBoardColumnDialog.vue";
import UpdateIssueBoardColumnDialog from "@/components/dialog/UpdateIssueBoardColumnDialog.vue";
import AddIssueToBoardDialog from "@/components/dialog/AddIssueToBoardDialog.vue";
import SelectIssueStateDialog, { type IssueStateSelection } from "@/components/dialog/SelectIssueStateDialog.vue";
import type { IssueBoardColumnInfoFragment, IssueBoardItemInfoFragment } from "@/gql/graphql";
import type { BoardDragState } from "@/components/board/boardDrag";
import type { IssueBoardColumnInitialValue } from "@/components/dialog/IssueBoardColumnDialogContent.vue";
import type { IdObject } from "@/util/types";

const getIssueBoardQuery = graphql(`
    query getIssueBoard($id: ID!) {
        node(id: $id) {
            __typename
            ... on IssueBoard {
                id
                name
                description
                issueBoardColumns(orderBy: [{ field: POSITION }], first: 100) {
                    nodes {
                        ...IssueBoardColumnInfo
                    }
                }
                issueBoardItems(orderBy: [{ field: POSITION }], first: 500) {
                    nodes {
                        ...IssueBoardItemInfo
                    }
                }
            }
        }
    }
`);

const deleteIssueBoardColumnMutation = graphql(`
    mutation deleteIssueBoardColumn($id: ID!) {
        deleteIssueBoardColumn(input: { id: $id }) {
            id
        }
    }
`);

const updateIssueBoardColumnPositionMutation = graphql(`
    mutation updateIssueBoardColumnPosition($id: ID!, $position: Float!) {
        updateIssueBoardColumn(input: { id: $id, position: $position }) {
            issueBoardColumn {
                id
                position
            }
        }
    }
`);

const updateIssueBoardItemPositionMutation = graphql(`
    mutation updateIssueBoardItemPosition($id: ID!, $position: Float!) {
        updateIssueBoardItem(input: { id: $id, position: $position }) {
            issueBoardItem {
                id
                position
            }
        }
    }
`);

const deleteIssueBoardItemMutation = graphql(`
    mutation deleteIssueBoardItem($id: ID!) {
        deleteIssueBoardItem(input: { id: $id }) {
            id
        }
    }
`);

const changeIssueStateOnBoardMutation = graphql(`
    mutation changeIssueStateOnBoard($issue: ID!, $state: ID!) {
        changeIssueState(input: { issue: $issue, state: $state }) {
            stateChangedEvent {
                id
            }
        }
    }
`);

interface DisplayedColumn {
    id: string | undefined;
    name: string;
    description: string;
    position: number;
    temporary: boolean;
    states: IssueBoardColumnInfoFragment["issueStates"]["nodes"];
    items: IssueBoardItemInfoFragment[];
}

const route = useRoute();
const router = useRouter();
const trackable = inject(trackableKey);

const trackableId = computed(() => route.params.trackable as string);
const boardId = computed(() => route.params.board as string);
const canManageBoard = computed(() => trackable?.value?.manageIssueBoards ?? false);
const canManageIssues = computed(() => trackable?.value?.manageIssues ?? false);

const reloadCount = ref(0);
const evaluating = shallowRef(false);
const board = computedAsync(
    async () => {
        reloadCount.value;
        if (!boardId.value) {
            return null;
        }
        return await withErrorMessage(
            () => queryNodeThrow(getIssueBoardQuery, "IssueBoard", { id: boardId.value }),
            "Error loading issue board"
        );
    },
    null,
    { shallow: false, evaluating }
);

function reload() {
    reloadCount.value++;
}

const columns = computed(() =>
    [...(board.value?.issueBoardColumns.nodes ?? [])].sort((a, b) => a.position - b.position)
);

/**
 * Maps the id of an issue state to the column it is assigned to.
 */
const columnByState = computed(() => {
    const result = new Map<string, string>();
    for (const column of columns.value) {
        for (const state of column.issueStates.nodes) {
            result.set(state.id, column.id);
        }
    }
    return result;
});

/**
 * The columns as rendered, which are the columns of the board plus, if there are issues whose state
 * is not assigned to any column, a temporary column collecting those issues.
 */
const displayedColumns = computed<DisplayedColumn[]>(() => {
    const items = board.value?.issueBoardItems.nodes ?? [];
    const itemsByColumn = new Map<string | undefined, IssueBoardItemInfoFragment[]>();
    for (const item of items) {
        const columnId = columnByState.value.get(item.issue.state.id);
        const existing = itemsByColumn.get(columnId);
        if (existing != undefined) {
            existing.push(item);
        } else {
            itemsByColumn.set(columnId, [item]);
        }
    }
    for (const columnItems of itemsByColumn.values()) {
        columnItems.sort((a, b) => a.position - b.position);
    }
    const result: DisplayedColumn[] = columns.value.map((column) => ({
        id: column.id,
        name: column.name,
        description: column.description,
        position: column.position,
        temporary: false,
        states: column.issueStates.nodes,
        items: itemsByColumn.get(column.id) ?? []
    }));
    const unmatched = itemsByColumn.get(undefined);
    if (unmatched != undefined && unmatched.length > 0) {
        result.push({
            id: undefined,
            name: "No matching state",
            description: "",
            position: Number.MAX_SAFE_INTEGER,
            temporary: true,
            states: [],
            items: unmatched
        });
    }
    return result;
});

const issuesOnBoard = computed(() => (board.value?.issueBoardItems.nodes ?? []).map((item) => item.issue.id));
const nextColumnPosition = computed(() => nextPosition(columns.value));
const nextItemPosition = computed(() => nextPosition(board.value?.issueBoardItems.nodes ?? []));

function nextPosition(entries: { position: number }[]): number {
    return entries.reduce((max, entry) => Math.max(max, entry.position), -1) + 1;
}

/**
 * Computes the position an entry needs to be placed at the provided index of `entries`.
 * `entries` must be sorted by position and must not contain the moved entry.
 */
function positionAtIndex(entries: { position: number }[], index: number): number {
    if (entries.length == 0) {
        return 0;
    }
    if (index <= 0) {
        return entries[0].position - 1;
    }
    if (index >= entries.length) {
        return entries[entries.length - 1].position + 1;
    }
    return (entries[index - 1].position + entries[index].position) / 2;
}

const columnToUpdate = ref<(IssueBoardColumnInitialValue & IdObject) | null>(null);

function editColumn(column: DisplayedColumn) {
    columnToUpdate.value = {
        id: column.id!,
        name: column.name,
        description: column.description,
        issueStates: column.states.map((state) => state.id),
        initialStates: [...column.states]
    };
}

async function deleteColumn(id: string) {
    await withErrorMessage(async () => {
        await requestThrow(deleteIssueBoardColumnMutation, { id });
    }, "Error deleting column");
    reload();
}

async function removeItem(item: IssueBoardItemInfoFragment) {
    await withErrorMessage(async () => {
        await requestThrow(deleteIssueBoardItemMutation, { id: item.id });
    }, "Error removing issue from board");
    reload();
}

function openIssue(item: IssueBoardItemInfoFragment) {
    router.push({
        name: route.name?.toString().startsWith("component") ? "component-issue" : "project-issue",
        params: { trackable: trackableId.value, issue: item.issue.id }
    });
}

const dragState = ref<BoardDragState | undefined>(undefined);
const columnDropIndex = ref<number | undefined>(undefined);

function startCardDrag(
    item: IssueBoardItemInfoFragment,
    columnId: string | undefined,
    dataTransfer: DataTransfer | null
) {
    if (dataTransfer != null) {
        dataTransfer.effectAllowed = "move";
        dataTransfer.setData("text/plain", item.issue.id);
    }
    dragState.value = { kind: "card", item, columnId };
}

function startColumnDrag(columnId: string, dataTransfer: DataTransfer | null) {
    if (dataTransfer != null) {
        dataTransfer.effectAllowed = "move";
        dataTransfer.setData("text/plain", columnId);
    }
    dragState.value = { kind: "column", columnId };
}

function endDrag() {
    dragState.value = undefined;
    columnDropIndex.value = undefined;
}

interface PendingDrop {
    item: IssueBoardItemInfoFragment;
    position: number;
}

const pendingDrop = ref<PendingDrop | null>(null);
const stateSelection = ref<IssueStateSelection | null>(null);

async function dropCard(column: DisplayedColumn, index: number) {
    const state = dragState.value;
    endDrag();
    if (state?.kind != "card" || column.temporary) {
        return;
    }
    const item = state.item;
    const remaining = column.items.filter((other) => other.id != item.id);
    const originalIndex = column.items.findIndex((other) => other.id == item.id);
    const targetIndex = originalIndex >= 0 && originalIndex < index ? index - 1 : index;
    const position = positionAtIndex(remaining, targetIndex);

    const needsStateChange = !column.states.some((columnState) => columnState.id == item.issue.state.id);
    if (!needsStateChange) {
        await moveItem(item, position);
        return;
    }
    if (column.states.length == 1) {
        await moveItem(item, position, column.states[0].id);
        return;
    }
    // the column is assigned multiple states, so the target state is ambiguous and has to be chosen
    pendingDrop.value = { item, position };
    stateSelection.value = { columnName: column.name, states: [...column.states] };
}

async function finishPendingDrop(stateId: string) {
    const drop = pendingDrop.value;
    pendingDrop.value = null;
    if (drop == null) {
        return;
    }
    await moveItem(drop.item, drop.position, stateId);
}

async function moveItem(item: IssueBoardItemInfoFragment, position: number, stateId?: string) {
    await withErrorMessage(async () => {
        if (stateId != undefined) {
            await requestThrow(changeIssueStateOnBoardMutation, { issue: item.issue.id, state: stateId });
        }
        if (position != item.position) {
            await requestThrow(updateIssueBoardItemPositionMutation, { id: item.id, position });
        }
    }, "Error moving issue");
    reload();
}

async function dropColumn() {
    const state = dragState.value;
    const dropIndex = columnDropIndex.value;
    endDrag();
    if (state?.kind != "column" || dropIndex == undefined) {
        return;
    }
    const remaining = columns.value.filter((column) => column.id != state.columnId);
    const originalIndex = columns.value.findIndex((column) => column.id == state.columnId);
    const targetIndex = originalIndex < dropIndex ? dropIndex - 1 : dropIndex;
    const position = positionAtIndex(remaining, targetIndex);
    const column = columns.value.find((it) => it.id == state.columnId);
    if (column == undefined || column.position == position) {
        return;
    }
    await withErrorMessage(async () => {
        await requestThrow(updateIssueBoardColumnPositionMutation, { id: state.columnId, position });
    }, "Error moving column");
    reload();
}

function onContainerDrop() {
    if (dragState.value?.kind == "column") {
        dropColumn();
    } else {
        endDrag();
    }
}

watch(board, () => {
    endDrag();
});
</script>
<style scoped lang="scss">
.board-container {
    // min-height 0 lets the scroll container shrink inside the flex column instead of overflowing it
    min-height: 0;
}

.board-scroll-container {
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: stretch;
}

.column-drop-indicator {
    width: 2px;
    flex: 0 0 auto;
    border-radius: 1px;
    background: rgb(var(--v-theme-primary));
}
</style>
