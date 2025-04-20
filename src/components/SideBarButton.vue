<template>
    <router-link v-slot="{ isActive, href, navigate, isExactActive }" :to="to" custom>
        <button class="sidebar-button" :class="{ active: isActive }" :disabled="disabled" @click="navigate">
            <div class="icon-container d-flex align-center justify-center">
                <v-expand-x-transition>
                    <div
                        v-show="chooseActive(isActive, isExactActive)"
                        class="icon-pill selected-pill mx-auto"
                        :style="`background: rgb(var(--v-theme-${color}-container))`"
                    ></div>
                </v-expand-x-transition>
                <div class="icon-pill overlay-pill"></div>
                <v-icon :color="iconColor(chooseActive(isActive, isExactActive))" :icon="icon" />
            </div>
            <div class="button-label text-caption">
                {{ text }}
            </div>
        </button>
    </router-link>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { RouteLocationRaw } from "vue-router";

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false,
        default: "secondary"
    },
    to: {
        type: [String, Object] as PropType<RouteLocationRaw>,
        required: false,
        default: null
    },
    exact: {
        type: Boolean,
        required: false,
        default: true
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    }
});

defineEmits(["click"]);

function iconColor(isActive: boolean): string {
    if (isActive) {
        return `rgb(var(--v-theme-on-${props.color}-container))`;
    } else {
        return `rgb(var(--v-theme-on-surface-variant))`;
    }
}

function chooseActive(isActive: boolean, isExactActive: boolean): boolean {
    if (props.exact) {
        return isExactActive;
    } else {
        return isActive;
    }
}
</script>
<style scoped lang="scss">
@use "vuetify/settings" as *;

.icon-container {
    overflow: hidden;
    width: 56px;
    height: 32px;
    position: relative;
}
.icon-pill {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 9999px;
}
.sidebar-button:hover .overlay-pill {
    opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier));
}
.sidebar-button:active .overlay-pill {
    opacity: calc(var(--v-pressed-opacity) * var(--v-theme-overlay-multiplier));
}
.overlay-pill {
    opacity: 0;
    background-color: currentColor;
    color: inherit;
}

.button-label {
    color: rgb(var(--v-theme-on-surface-variant));
}

.sidebar-button.active .button-label {
    color: rgb(var(--v-theme-on-surface));
}

.sidebar-button:disabled {
    pointer-events: none;
    opacity: $button-disabled-opacity;
}
</style>
