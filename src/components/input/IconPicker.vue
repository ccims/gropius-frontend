<template>
    <div>
        <div class="d-flex align-center my-2">
            <v-card
                variant="outlined"
                rounded="default"
                height="48px"
                width="48px"
                class="mr-2 flex-0-0 icon-preview d-flex align-center justify-center"
            >
                <SvgWrapper :path="model" />
            </v-card>
            <DefaultButton
                v-for="tab in tabs"
                :key="tab.value"
                variant="text"
                :active="activeTab === tab.value"
                :color="activeTab === tab.value ? 'primary' : 'default'"
                @click="activeTab = tab.value"
            >
                {{ tab.name }}
            </DefaultButton>
        </div>

        <v-window v-model="activeTab">
            <v-window-item value="select" class="pt-3">
                <v-text-field
                    v-model="iconSearch"
                    label="Search"
                    density="compact"
                    hide-details
                    rounded
                    class="mb-2"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                />

                <div class="icon-container">
                    <IconButton
                        v-for="icon in filteredIcons"
                        :key="icon.name"
                        class="icon-button"
                        :class="{ selected: selectedName === icon.name }"
                        :variant="selectedName === icon.name ? 'flat' : 'text'"
                        :color="selectedName === icon.name ? 'secondary-container' : ''"
                        @click="selectIcon(icon)"
                    >
                        <SvgWrapper :path="icon.iconPath" />
                        <v-tooltip activator="parent" location="top" scroll-strategy="close">
                            {{ icon.name }}
                        </v-tooltip>
                    </IconButton>
                </div>
            </v-window-item>

            <v-window-item value="custom" class="pt-3">
                <v-textarea
                    v-model="customPath"
                    label="SVG path"
                    rows="3"
                    no-resize
                    hide-details="auto"
                    :error-messages="pathErrorMessage"
                />

                <div class="text-caption text-medium-emphasis mt-1">Expected: 24x24 viewBox, fill color, no stroke</div>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import SvgWrapper from "../SvgWrapper.vue";
import { iconList } from "../icons";

const model = defineModel<string>({ required: true });

const tabs = [
    { name: "Select Icon", value: "select" },
    { name: "Custom", value: "custom" }
];

const allowedPath = /^[MmLlHhVvCcSsQqTtAaZz0-9 ,.\-]+$/;

const iconSearch = ref("");
const customPath = ref<string | null>(model.value);
// several icons share the same path, so the highlight has to follow the entry and not the path
const selectedName = ref<string>();
const activeTab = ref(model.value && !iconList.some((icon) => icon.iconPath === model.value) ? "custom" : "select");

watch(
    model,
    (iconPath) => {
        const selected = iconList.find((icon) => icon.name === selectedName.value);
        if (selected?.iconPath !== iconPath) {
            selectedName.value = iconList.find((icon) => icon.iconPath === iconPath)?.name;
        }
        // writing back while typing would strip the whitespace the user is still in the middle of
        if (normalizePath(customPath.value) !== iconPath) {
            customPath.value = iconPath;
        }
    },
    { immediate: true }
);

watch(customPath, (path) => {
    const normalized = normalizePath(path);
    if (normalized && !allowedPath.test(normalized)) {
        return;
    }
    model.value = normalized;
});

const pathErrorMessage = computed(() => {
    const normalized = normalizePath(customPath.value);
    return normalized && !allowedPath.test(normalized) ? "Only path commands, numbers and separators are allowed" : "";
});

const filteredIcons = computed(() => {
    if (!iconSearch.value) {
        return iconList;
    }
    return iconList.filter((icon) => icon.name.toLowerCase().includes(iconSearch.value.toLowerCase()));
});

function normalizePath(path: string | null): string {
    return (path ?? "").trim().replace(/"/g, "");
}

function selectIcon(icon: (typeof iconList)[number]) {
    selectedName.value = icon.name;
    model.value = icon.iconPath;
}
</script>

<style scoped>
.icon-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    max-height: 200px;
    overflow-y: auto;

    border: thin solid rgb(var(--v-theme-outline-variant));
    border-radius: 12px;
    padding: 8px;
}

.icon-button {
    width: 40px;
    height: 40px;
}

.icon-button :deep(svg) {
    width: 24px;
    height: 24px;
}

/* the svg fills with currentColor, the button itself keeps the on-secondary-container text color */
.icon-button.selected :deep(svg) {
    color: rgb(var(--v-theme-primary));
}

/* the outlined card draws its border with currentColor, the icon gets its own color */
.icon-preview {
    color: rgba(var(--v-theme-on-surface), 0.38);
}

.icon-preview :deep(svg) {
    color: rgb(var(--v-theme-primary));
}
</style>
