<template>
    <div>
        <task-lists
            sortable
            :disabled="!editable"
            @task-lists-move="handleTaskListsMove($event.detail)"
            @task-lists-check="handleTaskListsCheck($event.detail)"
        >
            <div ref="mdEditorContainer">
                <MdEditor
                    v-if="editMode"
                    ref="mdEditorRef"
                    class="editor"
                    v-model="model"
                    language="en-US"
                    :theme="theme.current.value.dark ? 'dark' : 'light'"
                    preview-theme="github"
                    :data-code-theme="theme.current.value.dark ? 'dark' : 'light'"
                    :code-foldable="false"
                    :toolbars="toolbars"
                    @update:model-value="handleModelUpdate"
                    @onUploadImg="onUploadImg"
                />
                <MdPreview
                    v-else
                    v-model="model"
                    language="en-US"
                    :theme="theme.current.value.dark ? 'dark' : 'light'"
                    preview-theme="github"
                    :data-code-theme="theme.current.value.dark ? 'dark' : 'light'"
                    :code-foldable="false"
                />
            </div>
        </task-lists>
    </div>
</template>
<script setup lang="ts">
import { MdEditor, MdPreview, ToolbarNames } from "md-editor-v3";
import { computed, nextTick, ref, watch } from "vue";
import "@github/task-lists-element";
import { useTheme } from "vuetify";
import { useAppStore } from "@/store/app";
import { useResizeObserver } from "@vueuse/core";

type ListItemPos = [number, number];

interface SourceRange {
    start: number;
    end: number;
}

const theme = useTheme();
const store = useAppStore();

const model = defineModel({
    type: String,
    default: ""
});

defineProps({
    editMode: {
        type: Boolean,
        required: true
    },
    editable: {
        type: Boolean,
        required: true
    }
});

const mdEditorContainer = ref<HTMLElement>();
const mdEditorRef = ref<any>();
const lastRerender = ref(Date.now());
const lastUpdateTime = ref(Date.now());
const containerWidth = ref(0);

useResizeObserver(mdEditorContainer, (entries) => {
    const entry = entries[0];
    if (entry) {
        containerWidth.value = entry.contentRect.width;
    }
});

watch(containerWidth, (newWidth, oldWidth) => {
    if (newWidth < 500 && oldWidth >= 500) {
        if (mdEditorRef.value) {
            mdEditorRef.value.togglePreview(false);
        }
    } else if (newWidth >= 500 && oldWidth < 500) {
        if (mdEditorRef.value) {
            mdEditorRef.value.togglePreview(true);
            mdEditorRef.value.togglePreviewOnly(false);
        }
    }
});

const toolbars = computed<ToolbarNames[]>(() => {
    const items: ToolbarNames[] = [];

    items.push(
        "bold",
        "underline",
        "italic",
        "strikeThrough",
        "-",
        "title",
        "quote",
        "unorderedList",
        "orderedList",
        "task"
    );

    if (containerWidth.value >= 710) {
        items.push("-", "codeRow", "code", "link", "image", "table", "mermaid", "katex");
    }

    if (containerWidth.value >= 500) {
        items.push("=", "prettier", "preview", "previewOnly");
    } else {
        items.unshift("previewOnly", "=");
    }

    return items;
});

async function handleModelUpdate() {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime.value;

    lastUpdateTime.value = now;

    if (timeSinceLastUpdate >= 500) {
        if (mdEditorRef.value) {
            await nextTick();
            mdEditorRef.value.rerender();
            lastRerender.value = now;
        }
    }
}

async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
    try {
        const dataUrls = await Promise.all(
            files.map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target?.result) {
                            resolve(e.target.result as string);
                        } else {
                            reject(new Error("Failed to read file"));
                        }
                    };
                    reader.onerror = () => reject(new Error("FileReader error"));
                    reader.readAsDataURL(file);
                });
            })
        );

        callback(dataUrls);
    } catch (error) {
        console.error("Failed to upload images:", error);
        callback([]);
    }
}

const lines = computed(() => {
    return model.value.split("\n");
});

function handleTaskListsMove({ src, dst }: { src: [number, number]; dst: [number, number] }) {
    try {
        const newValue = moveItem(src, dst, lines.value);
        model.value = newValue;
    } catch (e) {
        store.pushError("Failed to move item");
        console.error(e);
    }
}

function handleTaskListsCheck({ position, checked }: { position: [number, number]; checked: boolean }) {
    try {
        const newValue = toggleTaskListItem(position, checked, lines.value);
        model.value = newValue;
    } catch (e) {
        console.error("Failed to toggle task list item:", e);
    }
}

function toggleTaskListItem(position: ListItemPos, checked: boolean, source: string[]): string {
    const range = getSourceRange(position, source);
    const lineIndex = range.start;
    const line = source[lineIndex];

    const taskListPattern = /^(\s*)([-*+])\s+\[([ x])\]\s+(.*)$/;
    const match = line.match(taskListPattern);

    if (!match) {
        throw new Error("Line is not a valid task list item");
    }

    const [, indentation, marker, , content] = match;
    const newCheckState = checked ? "x" : " ";
    const newLine = `${indentation}${marker} [${newCheckState}] ${content}`;

    const newSource = [...source];
    newSource[lineIndex] = newLine;

    return newSource.join("\n");
}

function moveItem(src: ListItemPos, dest: ListItemPos, source: string[]): string {
    const { src: srcRange, dest: destRange } = extractListItem(src, dest, source);
    const srcIndentation = calculateIndentation(source[srcRange.start]);
    const destIndentation = calculateIndentation(source[destRange.start]);
    const srcText = source.slice(srcRange.start, srcRange.end).join("\n");
    const indentedSrcText = changeIndentation(srcText, destIndentation - srcIndentation);
    const destLine = calculateDestLine(src, dest, source);
    const transformedText = transformText(source, indentedSrcText, srcRange, destLine);
    return transformedText;
}

function calculateDestLine(src: ListItemPos, dest: ListItemPos, source: string[]): number {
    const [ulIndex, liIndex] = dest;
    if (liIndex === 0) {
        const liAfter = getSourceRange([ulIndex, 1], source);
        return liAfter.start;
    } else {
        let afterLiIndex = liIndex - 1;
        if (src[0] === ulIndex && src[1] < liIndex) {
            afterLiIndex--;
        }
        const liBefore = getSourceRange([ulIndex, afterLiIndex], source);
        return liBefore.end;
    }
}

function transformText(source: string[], text: string, srcRange: SourceRange, destLine: number): string {
    const beforeSrc = source.slice(0, srcRange.start);
    const afterSrc = source.slice(srcRange.end);

    const sourceAfterRemoval = [...beforeSrc, ...afterSrc];

    let adjustedDestLine = destLine;
    if (destLine > srcRange.start) {
        adjustedDestLine = destLine - (srcRange.end - srcRange.start);
    }

    const result = [
        ...sourceAfterRemoval.slice(0, adjustedDestLine),
        text,
        ...sourceAfterRemoval.slice(adjustedDestLine)
    ];

    return result.join("\n");
}

function calculateIndentation(source: string): number {
    let indentation = 0;
    for (let i = 0; i < length; i++) {
        const char = source[i];
        if (char === "\t") {
            indentation += 4;
        } else if (char === " ") {
            indentation++;
        } else if (/^[^\s]$/.test(char)) {
            break;
        }
    }
    return indentation;
}

function extractListItem(
    src: ListItemPos,
    dest: ListItemPos,
    source: string[]
): {
    src: SourceRange;
    dest: SourceRange;
} {
    let [ulIndex, liIndex] = dest;
    if (src[0] === ulIndex && src[1] < liIndex) {
        liIndex--;
    }
    const srcPos = getSourceRange([ulIndex, liIndex], source);
    let destPos: SourceRange;
    if (liIndex === 0) {
        destPos = getSourceRange([ulIndex, 1], source);
    } else {
        let afterLiIndex = liIndex - 1;
        if (src[0] === ulIndex && src[1] < liIndex) {
            afterLiIndex--;
        }
        destPos = getSourceRange([ulIndex, afterLiIndex], source);
    }
    return {
        src: srcPos,
        dest: destPos
    };
}

function changeIndentation(text: string, indentationDiff: number): string {
    const lines = text.split("\n");
    if (indentationDiff >= 0) {
        return lines
            .map((line) => {
                if (line == "") {
                    return "";
                }
                return " ".repeat(indentationDiff) + line;
            })
            .join("\n");
    } else {
        return removeIndentation(lines, -indentationDiff);
    }
}

function removeIndentation(lines: string[], diff: number): string {
    return lines
        .map((line) => {
            let currentIndentation = 0;
            let startPos = 0;
            for (let i = 0; i < line.length; i++) {
                let additionalIndentation = 0;
                if (line[i] === " ") {
                    additionalIndentation = 1;
                } else if (line[i] === "\t") {
                    additionalIndentation = 4;
                } else {
                    break;
                }
                if (currentIndentation + additionalIndentation <= diff) {
                    currentIndentation += additionalIndentation;
                    startPos++;
                } else {
                    break;
                }
            }
            return line.slice(startPos);
        })
        .join("\n");
}

function getListItem(listItemPos: ListItemPos): HTMLLIElement {
    const [ulIndex, liIndex] = listItemPos;
    const rootElement = mdEditorContainer.value!;
    const allUls = rootElement.querySelectorAll("ul");

    if (ulIndex < 0 || ulIndex >= allUls.length) {
        throw new Error("Invalid UL index");
    }

    const targetUl = allUls[ulIndex];
    const allLis = targetUl.querySelectorAll(":scope > li");

    if (liIndex < 0 || liIndex >= allLis.length) {
        throw new Error("Invalid LI index");
    }

    return allLis[liIndex] as HTMLLIElement;
}

function getSourceRange(listItemPos: ListItemPos, source: string[]): SourceRange {
    const li = getListItem(listItemPos);
    let end = Number(li.dataset.lineEnd);
    while (source[end - 1].trim() === "") {
        end--;
    }
    return {
        start: Number(li.dataset.line),
        end: end
    };
}
</script>
<style lang="scss">
@use "sass:meta";

*[data-code-theme="dark"] {
    @include meta.load-css("highlight.js/styles/github-dark.css");
}
*[data-code-theme="light"] {
    @include meta.load-css("highlight.js/styles/github.css");
}

.md-editor {
    --md-color: rgb(var(--v-theme-on-surface));
    --md-bk-color: transparent;
    --md-border-color: rgb(var(--v-theme-outline-variant));
    --md-scrollbar-bg-color: transparent;
    --md-bk-color-outstand: rgb(var(--v-theme-primary-container));
    border: none;
}

.md-editor div.github-theme {
    --md-theme-code-before-bg-color: rgb(var(--v-theme-surface-elevated-2));
}

.md-editor.editor {
    height: max(300px, 30vh);
}

.md-editor .md-editor-resize-operate {
    border-left: 1px solid var(--md-border-color);
}

.md-editor-code-flag {
    visibility: hidden;
}

.md-editor-preview .md-editor-code pre code {
    border-radius: var(--md-theme-code-block-radius) !important;
}

.md-editor-code-head {
    position: absolute !important;
    right: 0;
    width: unset !important;
}

.md-editor-preview {
    font-family: "Roboto", sans-serif !important;

    h1 {
        font-weight: 400 !important;
    }
    h2 {
        font-weight: 450 !important;
    }
    h3,
    h4,
    h5,
    h6 {
        font-weight: 500 !important;
    }

    & > *:first-child {
        margin-top: 0 !important;
    }

    & > *:last-child {
        margin-bottom: 0 !important;
    }

    .contains-task-list {
        padding: 0 !important;

        .task-list-item {
            padding: 2px 15px 2px 42px;
            margin-right: -15px;
            margin-left: -15px;

            .handle {
                display: none;
            }

            &.hovered .handle {
                display: block;
                float: left;
                width: 20px;
                padding: 2px 0 0 2px;
                margin-left: -43px;

                .drag-handle {
                    fill: var(--md-theme-color);
                }
            }
        }
        li:not(.task-list-item) {
            margin-left: 24px;
        }
    }
}
</style>
