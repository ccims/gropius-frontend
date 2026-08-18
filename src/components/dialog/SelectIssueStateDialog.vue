<template>
    <v-dialog v-model="dialog" persistent width="auto">
        <v-card color="surface-elevated-3" rounded="lger" class="pa-3 select-state-content" elevation="0">
            <v-card-title class="pl-4">Select issue state</v-card-title>
            <v-card-text class="pb-0">
                The column
                <span class="font-weight-medium">{{ cachedModel?.columnName }}</span>
                is assigned multiple issue states. Choose the state the issue should get.
            </v-card-text>
            <v-list class="pa-2" bg-color="transparent">
                <v-list-item
                    v-for="state in cachedModel?.states ?? []"
                    :key="state.id"
                    :title="state.name"
                    :subtitle="state.description"
                    rounded="lger"
                    :active="selected == state.id"
                    @click="selected = state.id"
                >
                    <template #prepend>
                        <v-icon
                            :style="`color: rgb(var(--v-theme-issue-${state.isOpen ? 'open' : 'closed'}))`"
                            class="opacity-100 mr-4"
                            icon="mdi-circle"
                        />
                    </template>
                </v-list-item>
            </v-list>
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
</style>
