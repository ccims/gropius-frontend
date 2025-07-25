<template>
    <div class="root h-100 w-100 d-flex flex-column">
        <div class="header d-flex align-center my-2">
            <div class="ml-5">
                <router-link to="/">
                    <DefaultButton class="d-flex" variant="text" icon size="small">
                        <img src="@/assets/logo.svg" width="40" />
                    </DefaultButton>
                </router-link>
            </div>
            <slot name="header-title">
                <div v-for="(segment, index) in titleSegments" :key="index" class="d-flex align-center">
                    <span v-if="index != 0" class="text-h6">/</span>
                    <router-link :to="segment.path" class="header-title-link">
                        <DefaultButton variant="text" class="px-1" min-width="0" rounded="lger">
                            <span v-if="'name' in segment" class="text-h6">{{ segment.name }}</span>
                            <v-icon v-else :icon="segment.icon" size="large" />
                        </DefaultButton>
                    </router-link>
                </div>
            </slot>
            <slot name="header-content">
                <div v-if="tabs.length > 0" class="ml-5">
                    <router-link
                        v-for="(tab, index) in tabs"
                        :key="`${index}-${tab.name}`"
                        :to="tab.path"
                        v-slot="{ isActive }"
                        custom
                    >
                        <DefaultButton
                            :value="tab.name"
                            :to="tab.path"
                            variant="text"
                            :color="isActive ? 'primary' : 'default'"
                        >
                            {{ tab.name }}
                        </DefaultButton>
                    </router-link>
                </div>
            </slot>
            <v-spacer />
            <div class="mr-5 d-flex">
                <v-btn icon variant="tonal" size="small" @click="toggleDarkMode()">
                    <v-icon :icon="lightMode ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="large" />
                    <v-tooltip activator="parent" location="bottom"> Toggle light/dark mode </v-tooltip>
                </v-btn>
                <v-btn v-if="store.user != undefined" icon size="small" variant="text" class="ml-3 avatar-button">
                    <img :src="store.user.avatar" class="avatar rounded-circle" />
                    <v-menu activator="parent" :close-on-content-click="false">
                        <AccountCard :user="store.user" />
                    </v-menu>
                </v-btn>
            </div>
        </div>
        <div class="h-0 d-flex flex-grow-1 mb-3">
            <div class="left-bar">
                <slot name="left-bar">
                    <SideBar :items="leftSidebarItems" class="w-100" />
                </slot>
            </div>
            <v-sheet color="surface" class="h-100 w-0 overflow-hidden flex-grow-1" rounded="xl">
                <slot name="content"></slot>
            </v-sheet>
            <div class="right-bar">
                <slot name="right-bar">
                    <SideBar :items="rightSidebarItems" class="w-100" />
                </slot>
            </div>
        </div>
    </div>
    <ErrorSnackbar />
</template>
<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { PropType } from "vue";
import { RouteLocationRaw } from "vue-router";
import { useTheme } from "vuetify";
import SideBar, { SideBarItem } from "./SideBar.vue";
import ErrorSnackbar from "./ErrorSnackbar.vue";
import { useAppStore } from "@/store/app";
import AccountCard from "./AccountCard.vue";

export type TitleSegment = {
    path: RouteLocationRaw;
} & (
    | {
          name: string;
      }
    | {
          icon: string;
      }
);
export interface TabSegment {
    name: string;
    path: RouteLocationRaw;
}

const props = defineProps({
    titleSegments: {
        type: Array as PropType<TitleSegment[]>,
        default: () => [{ name: "Gropius", path: "/" }]
    },
    tabs: {
        type: Array as PropType<TabSegment[]>,
        default: () => []
    },
    leftSidebarItems: {
        type: Array as PropType<SideBarItem[][]>,
        default: () => []
    },
    rightSidebarItems: {
        type: Array as PropType<SideBarItem[][]>,
        default: () => []
    }
});

const theme = useTheme();
const lightMode = useLocalStorage("lightMode", true);
const store = useAppStore();

function toggleDarkMode() {
    lightMode.value = !lightMode.value;
    updateColorMode();
}

function updateColorMode() {
    theme.change(lightMode.value ? "light" : "dark");
}

updateColorMode();
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";

.root {
    background: rgb(var(--v-theme-surface-container));
}

.left-bar,
.right-bar,
.side-bar-width {
    width: settings.$side-bar-width;
}

.left-bar,
.right-bar {
    height: 100%;
}

.avatar-button :deep(.v-btn__content),
.avatar {
    width: calc(var(--v-btn-height) + 12px);
    height: calc(var(--v-btn-height) + 12px);
}

.text-ellipsis {
    max-width: 100%;
}

.header-title-link {
    text-decoration-line: none;
}
</style>
