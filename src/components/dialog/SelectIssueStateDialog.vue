<template>
    <v-dialog v-model="dialog" persistent width="auto">
        <v-card color="surface-elevated-3" rounded="lger" class="pa-3 select-state-content" elevation="0">
            <v-card-title class="pl-4">Select issue state</v-card-title>
            <v-card-text class="text-medium-emphasis pb-4">
                The column
                <span class="font-weight-medium text-high-emphasis">{{ cachedModel?.columnName }}</span>
                is assigned multiple issue states. Choose the state the issue should get.
            </v-card-text>
            <div class="d-flex flex-column ga-2 px-4">
                <div
                    v-for="state in cachedModel?.states ?? []"
                    :key="state.id"
                    class="state-option d-flex align-center pa-3"
                    :class="{ 'state-option--selected': selected == state.id }"
                    @click="selected = state.id"
                >
                    <v-icon
                        :icon="selected == state.id ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
                        class="state-radio mr-3 flex-0-0"
                    />
                    <v-icon
                        icon="mdi-circle"
                        size="12"
                        :class="state.isOpen ? 'state-dot--open' : 'state-dot--closed'"
                        class="opacity-100 mr-3 flex-0-0"
                    />
                    <div class="flex-1-1 text-truncate">
                        <div>{{ state.name }}</div>
                        <div v-if="state.description" class="text-body-2 text-medium-emphasis text-truncate">
                            {{ state.description }}
                        </div>
                    </div>
                </div>
            </div>
            <v-card-actions>
                <v-spacer />
                <DefaultButton variant="text" color="" @click="cancel">Cancel</DefaultButton>
                <DefaultButton variant="text" color="primary" :disabled="!selected" @click="confirm">
                    Move issue
                </DefaultButton>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>
import type { DefaultIssueStateInfoFragment } from "@/gql/graphql";
import { computed, ref, watch, type PropType } from "vue";
import { useCachedRef } from "@/util/useCachedRef";

export interface IssueStateSelection {
    columnName: string;
    states: DefaultIssueStateInfoFragment[];
}

const model = defineModel({
    type: Object as PropType<IssueStateSelection | null>,
    required: false
});

const emit = defineEmits<{
    (event: "selected", state: string): void;
    (event: "cancel"): void;
}>();

const dialog = computed({
    get: () => model.value != null,
    set: (value) => {
        if (!value) {
            model.value = null;
        }
    }
});

const cachedModel = useCachedRef(model);
const selected = ref<string | undefined>(undefined);

watch(model, (value) => {
    if (value != undefined) {
        selected.value = undefined;
    }
});

function cancel() {
    dialog.value = false;
    emit("cancel");
}

function confirm() {
    const state = selected.value!;
    dialog.value = false;
    emit("selected", state);
}
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";

.select-state-content {
    width: min(500px, calc(100vw - 3 * settings.$side-bar-width));
}

.state-option {
    border: thin solid rgb(var(--v-theme-outline-variant));
    border-radius: 12px;
    cursor: pointer;

    &:hover {
        background: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
    }

    &--selected {
        border-color: rgb(var(--v-theme-primary));
        background: rgba(var(--v-theme-primary), 0.12);

        &:hover {
            background: rgba(var(--v-theme-primary), 0.16);
        }

        .state-radio {
            // the app disables Vuetify's color pack, so the theme color has to be applied directly
            color: rgb(var(--v-theme-primary));
        }
    }
}

.state-dot--open {
    color: rgb(var(--v-theme-issue-open));
}

.state-dot--closed {
    color: rgb(var(--v-theme-issue-closed));
}
</style>
