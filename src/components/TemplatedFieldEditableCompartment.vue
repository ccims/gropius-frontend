<template>
    <EditableCompartment
        :name="name"
        save-button
        :editable="editable"
        :has-unsaved-changes="hasUnsavedChanges"
        close-on-value-change
        :model-value="modelValue"
        @save="save"
        @close="updateValueCopy"
    >
        <template #display>
            <MetaForm
                class="pointer-events-none"
                :schema="schema"
                :root-schema="schema"
                :model-value="modelValue"
                readonly
            />
        </template>
        <template #edit>
            <v-form ref="editForm" v-model="formValid">
                <MetaForm
                    :schema="schema"
                    :root-schema="schema"
                    v-model="valueCopy"
                    @update:model-value="hasUnsavedChanges = true"
                />
            </v-form>
        </template>
    </EditableCompartment>
</template>
<script setup lang="ts">
import { type PropType, ref, toRaw, watch } from "vue";
import EditableCompartment from "./EditableCompartment.vue";
import MetaForm from "./input/schema/MetaForm.vue";
import type { Schema } from "jtd";

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    modelValue: {
        required: false
    },
    schema: {
        type: Object as PropType<Schema>,
        required: true
    },
    editable: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits<{
    (event: "save", value: any): void;
}>();

const hasUnsavedChanges = ref(false);
const formValid = ref(false);
const editForm = ref<any>(null);

const valueCopy = ref(copyModelValue());

watch(
    () => props.modelValue,
    () => {
        updateValueCopy();
    }
);

function updateValueCopy() {
    valueCopy.value = copyModelValue();
    hasUnsavedChanges.value = false;
}

function copyModelValue(): any {
    return structuredClone(toRaw(props.modelValue));
}

function save() {
    if (formValid.value) {
        emit("save", valueCopy.value);
        hasUnsavedChanges.value = false;
    } else {
        editForm.value.validate();
    }
}
</script>
<style scoped>
.pointer-events-none {
    pointer-events: none;
}
</style>
