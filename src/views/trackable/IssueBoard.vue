<template>
    <div class="d-flex flex-column h-100">
        <div v-if="board == undefined" class="text-medium-emphasis pa-4">
            {{ evaluating ? "Loading issue board..." : "Issue board not found" }}
        </div>
        <template v-else>
            <!-- the padding sits on the wrapper, so the gutter around the board stays put while scrolling -->
            <div class="board-container flex-1-1 pa-3">
                <div
                    ref="scrollContainer"
                    class="board-scroll-container d-flex ga-3"
                    @dragover.prevent
                    @drop="onContainerDrop"
                    @wheel="onWheel"
                >
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
        <UpdateIssueBoardDialog
            v-model="boardToUpdate"
            :deletable="canManageBoard"
            @updated-issue-board="boardUpdated()"
            @deleted-issue-board="openBoardList()"
        />
        <SelectIssueStateDialog v-model="stateSelection" @selected="finishPendingDrop" @cancel="pendingDrop = null" />
    </div>
</template>
<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import { computed, inject, onBeforeUnmount, ref, shallowRef, useTemplateRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { withErrorMessage } from "@/util/withErrorMessage";
import { eventBusKey, trackableKey } from "@/util/keys";
import IssueBoardColumn from "@/components/board/IssueBoardColumn.vue";
import CreateIssueBoardColumnDialog from "@/components/dialog/CreateIssueBoardColumnDialog.vue";
import UpdateIssueBoardColumnDialog from "@/components/dialog/UpdateIssueBoardColumnDialog.vue";
import AddIssueToBoardDialog from "@/components/dialog/AddIssueToBoardDialog.vue";
import UpdateIssueBoardDialog from "@/components/dialog/UpdateIssueBoardDialog.vue";
import SelectIssueStateDialog, { type IssueStateSelection } from "@/components/dialog/SelectIssueStateDialog.vue";
import type { IssueBoardColumnInfoFragment, IssueBoardItemInfoFragment } from "@/gql/graphql";
import type { BoardDragState } from "@/components/board/boardDrag";
import type { IssueBoardColumnInitialValue } from "@/components/dialog/IssueBoardColumnDialogContent.vue";
import type { IdObject } from "@/util/types";
import { onEvent } from "@/util/eventBus";

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

const eventBus = inject(eventBusKey);
const boardToUpdate = ref<{ id: string; name: string; description: string } | null>(null);

function boardUpdated() {
    reload();
    // the name of the board is part of the title of the page
    eventBus?.emit("title-segment-changed");
}

onEvent("edit-issue-board", () => {
    const currentBoard = board.value;
    if (currentBoard != undefined) {
        boardToUpdate.value = {
            id: currentBoard.id,
            name: currentBoard.name,
            description: currentBoard.description
        };
    }
});

function openBoardList() {
    router.push({
        name: route.name?.toString().startsWith("component") ? "component-issue-boards" : "project-issue-boards",
        params: { trackable: trackableId.value }
    });
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

const scrollContainer = useTemplateRef("scrollContainer");

/**
 * Checks whether the element itself scrolls vertically, which means it should keep the wheel event.
 */
function scrollsVertically(element: HTMLElement): boolean {
    if (element.scrollHeight <= element.clientHeight) {
        return false;
    }
    const overflowY = getComputedStyle(element).overflowY;
    return overflowY == "auto" || overflowY == "scroll";
}

/** Fraction of the remaining distance the scroll animation covers per frame */
const scrollEasing = 0.25;
/**
 * Smallest step of the scroll animation, scrollLeft can be rounded to whole pixels,
 * so smaller steps would never arrive at the target.
 */
const scrollMinimumStep = 1;

/** Frames after the last wheel tick before the animation gives up and jumps to the target */
const scrollMaximumFrames = 60;

let scrollTarget: number | undefined = undefined;
let scrollAnimation: number | undefined = undefined;
let scrollFramesLeft = 0;
/** The position the animation last set, to tell its own scrolling apart from that of the user */
let animatedPosition: number | undefined = undefined;

function stopScrollAnimation() {
    if (scrollAnimation != undefined) {
        cancelAnimationFrame(scrollAnimation);
    }
    scrollAnimation = undefined;
    scrollTarget = undefined;
    animatedPosition = undefined;
}

/**
 * Scrolls the board towards the current target, easing out like the scrolling of the browser itself
 * instead of jumping by a whole wheel tick at once. Scrolling by any other means, for example by
 * dragging the scrollbar, ends the animation instead of fighting it.
 */
function animateScroll() {
    const container = scrollContainer.value;
    if (container == undefined || scrollTarget == undefined) {
        stopScrollAnimation();
        return;
    }
    if (animatedPosition != undefined && Math.abs(container.scrollLeft - animatedPosition) > scrollMinimumStep) {
        stopScrollAnimation();
        return;
    }
    const distance = scrollTarget - container.scrollLeft;
    // the animation must never outlive its target, an endless loop would block scrolling by other means
    if (Math.abs(distance) <= scrollMinimumStep || scrollFramesLeft <= 0) {
        container.scrollLeft = scrollTarget;
        stopScrollAnimation();
        return;
    }
    scrollFramesLeft--;
    const step = distance * scrollEasing;
    container.scrollLeft += Math.abs(step) < scrollMinimumStep ? Math.sign(distance) * scrollMinimumStep : step;
    // the browser may round the position, so the next frame compares against what it actually stored
    animatedPosition = container.scrollLeft;
    scrollAnimation = requestAnimationFrame(animateScroll);
}

/**
 * The delta of a wheel event is not necessarily in pixels, the other modes have to be converted.
 */
function wheelDeltaInPixels(event: WheelEvent, container: HTMLElement): number {
    if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
        return event.deltaY * 16;
    }
    if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
        return event.deltaY * container.clientWidth;
    }
    return event.deltaY;
}

/**
 * Turns vertical scrolling into horizontal scrolling of the board, unless the pointer is over
 * something that scrolls vertically itself, like the body of a column with more cards than fit.
 */
function onWheel(event: WheelEvent) {
    const container = scrollContainer.value;
    // horizontal scrolling, for example on a touchpad, already does the right thing on its own
    if (container == undefined || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || event.shiftKey || event.ctrlKey) {
        return;
    }
    if (container.scrollWidth <= container.clientWidth) {
        return;
    }
    let element = event.target as HTMLElement | null;
    while (element != null && element != container) {
        if (scrollsVertically(element)) {
            return;
        }
        element = element.parentElement;
    }
    event.preventDefault();
    const maxScroll = container.scrollWidth - container.clientWidth;
    // ticks arriving while the animation is running add up instead of restarting it
    const target = (scrollTarget ?? container.scrollLeft) + wheelDeltaInPixels(event, container);
    scrollTarget = Math.max(0, Math.min(maxScroll, target));
    scrollFramesLeft = scrollMaximumFrames;
    if (scrollAnimation == undefined) {
        animatedPosition = container.scrollLeft;
        scrollAnimation = requestAnimationFrame(animateScroll);
    }
}

onBeforeUnmount(stopScrollAnimation);

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
