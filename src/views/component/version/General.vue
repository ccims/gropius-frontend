<template>
    <div class="pa-4 h-100 overflow-y-auto" v-if="componentVersion != undefined && component != undefined">
        <DetailCompartment name="General">
            <InputWrapper
                v-model="componentVersion.name"
                v-slot="{ modelValue }"
                @save="save({ name: $event })"
                :readonly="!component.admin"
            >
                <v-text-field v-model="modelValue.value" label="Name" :readonly="!component.admin" />
            </InputWrapper>
            <InputWrapper
                v-model="componentVersion.version"
                v-slot="{ modelValue }"
                @save="save({ version: $event })"
                :readonly="!component.admin"
            >
                <v-text-field v-model="modelValue.value" label="Version" :readonly="!component.admin" />
            </InputWrapper>
            <InputWrapper
                v-model="component.description"
                v-slot="{ modelValue }"
                @save="save({ description: $event })"
                :readonly="!component.admin"
            >
                <v-textarea v-model="modelValue.value" label="Description" :readonly="!component.admin" />
            </InputWrapper>
        </DetailCompartment>
        <DetailCompartment name="Templated Fields" class="mt-4">
            <div v-if="componentVersion.templatedFields.length == 0" class="mt-n1 text-medium-emphasis">
                No templated fields available
            </div>
            <InputWrapper
                v-for="templatedField in templatedFields"
                :key="templatedField.name"
                v-model="templatedField.value"
                :readonly="!component.admin"
                v-slot="{ modelValue }"
                @save="save({ templatedFields: [{ name: templatedField.name, value: $event }] })"
            >
                <MetaForm
                    :schema="templatedField.schema"
                    :root-schema="templatedField.schema"
                    v-model="modelValue.value"
                    :readonly="!component.admin"
                />
            </InputWrapper>
        </DetailCompartment>
    </div>
</template>
<script lang="ts" setup>
import DetailCompartment from "@/components/DetailCompartment.vue";
import InputWrapper from "@/components/input/InputWrapper.vue";
import MetaForm from "@/components/input/schema/MetaForm.vue";
import { NodeReturnType, useClient } from "@/graphql/client";
import { UpdateComponentVersionInput } from "@/graphql/generated";
import { eventBusKey, trackableKey } from "@/util/keys";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { inject } from "vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const client = useClient();
const route = useRoute();
const eventBus = inject(eventBusKey);
const componentVersionId = computed(() => route.params.version as string);

const component = inject(trackableKey);

const componentVersion = computedAsync(
    async () => {
        if (!componentVersionId.value) {
            return null;
        }
        const res = await withErrorMessage(
            () => client.getComponentVersionGeneralDetails({ id: componentVersionId.value }),
            "Error loading componentVersion details"
        );
        return res.node as NodeReturnType<"getComponentVersionGeneralDetails", "ComponentVersion">;
    },
    null,
    { shallow: false }
);

const templatedFields = computed(() => {
    if (componentVersion.value == undefined) {
        return [];
    }
    const templatedFieldsValues = new Map<string, any>();
    for (const field of componentVersion.value.templatedFields) {
        templatedFieldsValues.set(field.name, field.value);
    }
    return componentVersion.value.template.templateFieldSpecifications.map((field) => ({
        name: field.name,
        schema: field.value,
        value: templatedFieldsValues.get(field.name)
    }));
});

async function save(input: Omit<UpdateComponentVersionInput, "id">) {
    await withErrorMessage(
        () =>
            client.updateComponentVersion({
                input: {
                    id: componentVersionId.value,
                    ...input
                }
            }),
        "Error updating componentVersion details"
    );
    if ("name" in input) {
        eventBus?.emit("title-segment-changed");
    }
}
</script>
