<template>
    <DetailCompartment name="General">
        <div v-if="hint" class="text-medium-emphasis mb-4">{{ hint }}</div>
        <InputWrapper
            :model-value="name"
            v-slot="{ modelValue }"
            :readonly="readonly"
            @save="emit('save', { name: $event })"
        >
            <v-text-field v-model="modelValue.value" label="Name" :readonly="readonly" :rules="[nameRequired]" />
        </InputWrapper>
        <InputWrapper
            :model-value="description"
            v-slot="{ modelValue }"
            :readonly="readonly"
            @save="emit('save', { description: $event })"
        >
            <v-textarea v-model="modelValue.value" label="Description" :readonly="readonly" auto-grow rows="2" />
        </InputWrapper>

        <slot />

        <div v-if="status" class="field-group">
            <div class="field-label text-medium-emphasis">Status</div>
            <div class="field-value">{{ status }}</div>
        </div>
    </DetailCompartment>
</template>

<script lang="ts" setup>
import DetailCompartment from "./DetailCompartment.vue";
import InputWrapper from "./input/InputWrapper.vue";

defineProps({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    /** Shown as the status of the template, omitted for sub templates which cannot be deprecated */
    status: {
        type: String,
        required: false
    },
    /** Explains what the template applies to */
    hint: {
        type: String,
        required: false
    },
    readonly: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits<{
    (event: "save", value: { name?: string; description?: string }): void;
}>();

function nameRequired(value: string) {
    return !!value || "Name is required";
}
</script>

<style scoped lang="scss">
.field-group {
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
}

.field-label {
    font-size: 12px;
    margin-bottom: 4px;
}

.field-value {
    font-size: 16px;
}
</style>
