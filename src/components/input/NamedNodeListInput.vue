<template>
    <div>
        <v-btn variant="tonal" block :prepend-icon="addIcon" @click="add">{{ addLabel }}</v-btn>
        <ExpandableCard
            v-for="entry in model"
            :key="entry.name"
            :name="entry.name"
            :description="entry.description"
            :expanded-card-key="expandedCardKey"
            :type="type"
            v-model:name-error-message="nameErrorMessage"
            @expand="expand(entry)"
            @cancel="cancel()"
            @delete="remove(entry)"
            @confirm="({ name, description }) => confirm(entry, name, description)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import ExpandableCard from "../ExpandableCard.vue";

export interface NamedNodeState {
    name: string;
    description: string;
}

const model = defineModel({
    type: Array as PropType<NamedNodeState[]>,
    required: true
});

const props = defineProps({
    addLabel: {
        type: String,
        required: true
    },
    addIcon: {
        type: String,
        required: false,
        default: "mdi-plus"
    },
    /** Distinguishes the cards of this list from the cards of other lists in the same dialog */
    type: {
        type: String,
        required: true
    }
});

const expandedName = ref<string>();
const nameErrorMessage = ref("");

const expandedCardKey = computed(() =>
    expandedName.value != undefined ? { nameID: expandedName.value, type: props.type } : null
);

function add() {
    if (model.value.some((entry) => entry.name == "")) {
        return;
    }
    model.value = [...model.value, { name: "", description: "" }];
    expandedName.value = "";
    nameErrorMessage.value = "";
}

function expand(entry: NamedNodeState) {
    expandedName.value = entry.name;
    nameErrorMessage.value = "";
}

function cancel() {
    // an aborted add leaves the still unnamed placeholder behind
    model.value = model.value.filter((entry) => entry.name != "");
    expandedName.value = undefined;
    nameErrorMessage.value = "";
}

function remove(entry: NamedNodeState) {
    model.value = model.value.filter((other) => other !== entry);
    if (expandedName.value == entry.name) {
        expandedName.value = undefined;
    }
}

function confirm(entry: NamedNodeState, name: string, description: string) {
    const newName = name.trim();
    if (!newName) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (model.value.some((other) => other !== entry && other.name.toLowerCase() == newName.toLowerCase())) {
        nameErrorMessage.value = "Name already exists";
        return;
    }
    model.value = model.value
        .map((other) => (other === entry ? { name: newName, description } : other))
        .sort((a, b) => a.name.localeCompare(b.name));
    expandedName.value = undefined;
    nameErrorMessage.value = "";
}
</script>
