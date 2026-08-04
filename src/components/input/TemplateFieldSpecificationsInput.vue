<template>
    <div>
        <v-btn variant="tonal" block prepend-icon="mdi-form-textbox" @click="add">
            Add Template Field Specification
        </v-btn>
        <ExpandableCard
            v-for="field in model"
            :key="field.name"
            :name="field.name"
            :expanded-card-key="expandedCardKey"
            type="templateFieldSpecification"
            v-model:name-error-message="nameErrorMessage"
            :editable="!inheritedNames.includes(field.name)"
            @expand="expand(field)"
            @cancel="cancel()"
            @delete="remove(field)"
            @confirm="({ name }) => confirm(field, name)"
        >
            <template #details>
                <SchemaTypeTree :schema="field.value" :root-schema="field.value" />
            </template>
            <template #extra>
                <TemplatedFieldSpecificationsValueBox v-model="editedValue" />
            </template>
        </ExpandableCard>
    </div>
</template>

<script setup lang="ts">
import type { JsonFieldInput } from "@/gql/graphql";
import { computed, ref, toRaw, type PropType } from "vue";
import ExpandableCard from "../ExpandableCard.vue";
import SchemaTypeTree from "../info/SchemaTypeTree.vue";
import TemplatedFieldSpecificationsValueBox from "../TemplatedFieldSpecificationsValueBox.vue";

const model = defineModel({
    type: Array as PropType<JsonFieldInput[]>,
    required: true
});

const props = defineProps({
    /**
     * Names of the specifications that come from an extended template.
     * They are shown, but cannot be edited or removed.
     */
    inheritedNames: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    }
});

const expandedName = ref<string>();
const editedValue = ref<any>({ type: "string" });
const nameErrorMessage = ref("");

const expandedCardKey = computed(() =>
    expandedName.value != undefined ? { nameID: expandedName.value, type: "templateFieldSpecification" } : null
);

function add() {
    if (model.value.some((field) => field.name == "")) {
        return;
    }
    editedValue.value = { type: "string" };
    model.value = [...model.value, { name: "", value: editedValue.value }];
    expandedName.value = "";
    nameErrorMessage.value = "";
}

function expand(field: JsonFieldInput) {
    editedValue.value = structuredClone(toRaw(field.value));
    expandedName.value = field.name;
    nameErrorMessage.value = "";
}

function cancel() {
    // an aborted add leaves the still unnamed placeholder behind
    model.value = model.value.filter((field) => field.name != "");
    expandedName.value = undefined;
    nameErrorMessage.value = "";
}

function remove(field: JsonFieldInput) {
    model.value = model.value.filter((other) => other !== field);
    if (expandedName.value == field.name) {
        expandedName.value = undefined;
    }
}

function confirm(field: JsonFieldInput, name: string) {
    const newName = name.trim();
    if (!newName) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (model.value.some((other) => other !== field && other.name.toLowerCase() == newName.toLowerCase())) {
        nameErrorMessage.value = "Name already exists";
        return;
    }
    model.value = sortedByInheritance(
        model.value.map((other) => (other === field ? { name: newName, value: editedValue.value } : other))
    );
    expandedName.value = undefined;
    nameErrorMessage.value = "";
}

// inherited specifications cannot be changed, so they are moved out of the way
function sortedByInheritance(fields: JsonFieldInput[]): JsonFieldInput[] {
    return [...fields].sort((a, b) => {
        const aInherited = props.inheritedNames.includes(a.name);
        const bInherited = props.inheritedNames.includes(b.name);
        if (aInherited != bInherited) {
            return aInherited ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
    });
}
</script>
