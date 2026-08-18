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
            :editable="!inheritedNames.includes(entry.name)"
            v-model:name-error-message="nameErrorMessage"
            @expand="expand(entry)"
            @cancel="cancel()"
            @delete="remove(entry)"
            @confirm="({ name, description }) => confirm(entry, name, description)"
        >
            <!--
                The slots are only forwarded when the parent actually fills them, otherwise every card
                would count as having details and offer the expand arrow for an empty box.
            -->
            <template v-if="$slots.previewLeft" #previewLeft>
                <slot name="previewLeft" :entry="entry" />
            </template>
            <template v-if="$slots.previewRight" #previewRight>
                <slot name="previewRight" :entry="entry" />
            </template>
            <template v-if="$slots.details" #details>
                <slot name="details" :entry="entry" />
            </template>
            <template v-if="$slots.extra" #extra>
                <!-- edits go to a copy, so cancelling an edit does not leave the changed fields behind -->
                <slot v-if="editedEntry != undefined" name="extra" :entry="editedEntry" :error="extraErrorMessage" />
            </template>
        </ExpandableCard>
    </div>
</template>

<script setup lang="ts" generic="T extends NamedNodeState">
import { computed, ref, toRaw, type PropType, type Ref } from "vue";
import ExpandableCard from "../ExpandableCard.vue";

export interface NamedNodeState {
    name: string;
    description: string;
}

const model = defineModel<T[]>({ required: true });

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
    },
    /**
     * Names of the entries that come from an extended template.
     * They are shown, but cannot be edited or removed.
     */
    inheritedNames: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    },
    /** The entry a click on the add button starts from, for lists whose entries have more than a name */
    newEntry: {
        type: Function as PropType<() => T>,
        required: false,
        default: undefined
    },
    /** Checks the fields the `extra` slot edits, the returned message blocks the confirmation */
    validate: {
        type: Function as PropType<(entry: T) => string | undefined>,
        required: false,
        default: undefined
    }
});

const expandedName = ref<string>();
// generic refs unwrap to UnwrapRef<T>, which drops back to T for the flat entries this holds
const editedEntry = ref<T>() as Ref<T | undefined>;
const nameErrorMessage = ref("");
const extraErrorMessage = ref("");

const expandedCardKey = computed(() =>
    expandedName.value != undefined ? { nameID: expandedName.value, type: props.type } : null
);

function add() {
    if (model.value.some((entry) => entry.name == "")) {
        return;
    }
    const entry = props.newEntry?.() ?? ({ name: "", description: "" } as T);
    model.value = [...model.value, entry];
    editedEntry.value = { ...entry };
    expandedName.value = "";
    nameErrorMessage.value = "";
    extraErrorMessage.value = "";
}

function expand(entry: T) {
    editedEntry.value = structuredClone(toRaw(entry));
    expandedName.value = entry.name;
    nameErrorMessage.value = "";
    extraErrorMessage.value = "";
}

function cancel() {
    // an aborted add leaves the still unnamed placeholder behind
    model.value = model.value.filter((entry) => entry.name != "");
    close();
}

function remove(entry: T) {
    model.value = model.value.filter((other) => other !== entry);
    if (expandedName.value == entry.name) {
        close();
    }
}

function confirm(entry: T, name: string, description: string) {
    const newName = name.trim();
    if (!newName) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (model.value.some((other) => other !== entry && other.name.toLowerCase() == newName.toLowerCase())) {
        nameErrorMessage.value = "Name already exists";
        return;
    }
    const edited = { ...(editedEntry.value ?? entry), name: newName, description };
    const error = props.validate?.(edited);
    if (error != undefined) {
        extraErrorMessage.value = error;
        return;
    }
    model.value = sortedByInheritance(model.value.map((other) => (other === entry ? edited : other)));
    close();
}

function close() {
    expandedName.value = undefined;
    editedEntry.value = undefined;
    nameErrorMessage.value = "";
    extraErrorMessage.value = "";
}

// inherited entries cannot be changed, so they are moved out of the way
function sortedByInheritance(entries: T[]): T[] {
    return [...entries].sort((a, b) => {
        const aInherited = props.inheritedNames.includes(a.name);
        const bInherited = props.inheritedNames.includes(b.name);
        if (aInherited != bInherited) {
            return aInherited ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
    });
}
</script>
