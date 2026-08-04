<template>
    <div>
        <div class="text-medium-emphasis mb-4">{{ description }}</div>
        <v-row>
            <v-col cols="6">
                <v-text-field
                    v-model="model.name"
                    label="Name"
                    :error-messages="model.name.trim() ? [] : ['Name is required']"
                />
            </v-col>
            <v-col cols="6">
                <v-textarea v-model="model.description" label="Description" auto-grow rows="1" max-rows="3" />
            </v-col>
        </v-row>
        <TemplateFieldSpecificationsInput v-model="model.templateFieldSpecifications" />
    </div>
</template>

<script setup lang="ts">
import type { SubTemplateState } from "@/util/templateInputs";
import type { PropType } from "vue";
import TemplateFieldSpecificationsInput from "./TemplateFieldSpecificationsInput.vue";

const model = defineModel({
    type: Object as PropType<SubTemplateState>,
    required: true
});

defineProps({
    /** Explains which entities the sub template applies to */
    description: {
        type: String,
        required: true
    }
});
</script>
