<template>
    <div class="node-wrapper">
        <div class="d-flex align-center ga-2">
            <v-text-field
                v-if="isNamed"
                v-model="localName"
                :error-messages="nameErrorMessages"
                density="compact"
                hide-details="auto"
                label="Name"
                class="name-input"
            />
            <v-select
                :model-value="selectedType"
                @update:model-value="changeType"
                :items="typeItems"
                density="compact"
                hide-details="auto"
                label="Type"
                class="type-select"
            />
            <IconButton v-if="isNamed" class="ms-auto" @click="emit('delete')">
                <v-icon>mdi-close</v-icon>
            </IconButton>
        </div>

        <div v-if="node.type === 'enum'" class="nested d-flex flex-column align-start">
            <EditableCard
                v-for="(entry, index) in node.values"
                :key="index"
                :content="entry"
                color="secondary"
                variant="tonal"
                prepend-icon="mdi-circle-medium"
                @confirm="(payload) => updateEnumEntry(index, payload.content)"
                @delete="removeEnumEntry(index)"
            />
            <v-btn prepend-icon="mdi-plus" variant="text" size="small" @click="addEnumEntry">Add option</v-btn>
        </div>

        <div v-else-if="node.type === 'list'" class="nested">
            <TemplatedFieldSpecificationsValueBox
                :model-value="modelValue.elements"
                @update:model-value="(value) => emit('update:modelValue', { ...modelValue, elements: value })"
            />
        </div>

        <div v-else-if="node.type === 'map'" class="nested">
            <TemplatedFieldSpecificationsValueBox
                :model-value="modelValue.values"
                @update:model-value="(value) => emit('update:modelValue', { ...modelValue, values: value })"
            />
        </div>

        <div v-else-if="node.type === 'object'" class="nested">
            <TemplatedFieldSpecificationsValueBox
                v-for="(child, index) in node.children"
                :key="index"
                class="property"
                :model-value="modelValue.properties[child.name]"
                :name="child.name"
                :reserved-names="node.children.filter((other) => other.name !== child.name).map((other) => other.name)"
                @update:model-value="(value) => updateProperty(child.name, value)"
                @update:name="(value) => renameProperty(child.name, value)"
                @delete="removeProperty(child.name)"
            />
            <v-btn prepend-icon="mdi-plus" variant="text" size="small" @click="addProperty">Add field</v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import EditableCard from "./EditableCard.vue";
import { templateFieldTypeOptions } from "@/util/templateFieldSpecifications";

// the backend validates specifications as JSON Type Definition: https://jsontypedef.com/docs/jtd-in-5-minutes/
const primitiveTypes = [
    "boolean",
    "string",
    "timestamp",
    "float32",
    "float64",
    "int8",
    "uint8",
    "int16",
    "uint16",
    "int32",
    "uint32"
] as const;

type PrimitiveType = (typeof primitiveTypes)[number];

interface PrimitiveNode {
    type: "primitive";
    kind: PrimitiveType;
}

interface EnumNode {
    type: "enum";
    values: string[];
}

interface ObjectNode {
    type: "object";
    children: { name: string; node: Node }[];
}

interface ListNode {
    type: "list";
    elementType: Node;
}

interface MapNode {
    type: "map";
    valueType: Node;
}

type Node = PrimitiveNode | EnumNode | ObjectNode | ListNode | MapNode;

type Form = "enum" | "elements" | "values" | "properties";

const props = defineProps<{
    modelValue?: any;
    /**
     * If provided, the node is rendered as a named property: its name is always editable
     * next to the type select, and the node can be deleted.
     */
    name?: string;
    /**
     * Names of the sibling properties, used to reject duplicate names.
     */
    reservedNames?: string[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: any): void;
    (e: "update:name", value: string): void;
    (e: "delete"): void;
}>();

// the names, icons and explanations are shared with the read only views of a specification
const typeItems = templateFieldTypeOptions.map((option) => ({
    title: option.info.label,
    value: option.value,
    props: {
        prependIcon: option.info.icon,
        // several types share a name, like the whole numbers, the subtitle is what tells them apart
        subtitle: `${option.info.technical} · ${option.info.hint}`
    }
}));

const node = computed(() => processNode(props.modelValue));

const selectedType = computed<PrimitiveType | Form>(() => {
    switch (node.value.type) {
        case "primitive":
            return node.value.kind;
        case "enum":
            return "enum";
        case "list":
            return "elements";
        case "map":
            return "values";
        case "object":
            return "properties";
    }
});

const isNamed = computed(() => props.name != undefined);

const localName = ref(props.name ?? "");

const nameErrorMessages = computed(() => {
    if (!isNamed.value) {
        return [];
    }
    if (!localName.value) {
        return ["Name is required"];
    }
    if (props.reservedNames?.includes(localName.value)) {
        return ["Name already in use"];
    }
    return [];
});

watch(
    () => props.name,
    (newName) => {
        localName.value = newName ?? "";
    }
);

watch(localName, (newName) => {
    if (newName === props.name || nameErrorMessages.value.length > 0) {
        return;
    }
    emit("update:name", newName);
});

function processNode(rawNode: any): Node {
    if (typeof rawNode?.type === "string") {
        return { type: "primitive", kind: rawNode.type as PrimitiveType };
    }
    if (rawNode?.enum != undefined) {
        return { type: "enum", values: rawNode.enum };
    }
    if (rawNode?.elements != undefined) {
        return { type: "list", elementType: processNode(rawNode.elements) };
    }
    if (rawNode?.values != undefined) {
        return { type: "map", valueType: processNode(rawNode.values) };
    }
    const properties = Object.entries(rawNode?.properties ?? {}).filter(
        ([key]) => key !== "nullable" && key !== "__typename"
    );
    return {
        type: "object",
        children: properties.map(([name, value]) => ({ name, node: processNode(value) }))
    };
}

function defaultValueForType(type: PrimitiveType | Form): any {
    switch (type) {
        case "enum":
            return { enum: ["value"] };
        case "elements":
            return { elements: { type: "string" } };
        case "values":
            return { values: { type: "string" } };
        case "properties":
            return { properties: {} };
        default:
            return { type };
    }
}

function changeType(type: PrimitiveType | Form) {
    emit("update:modelValue", defaultValueForType(type));
}

function addEnumEntry() {
    emit("update:modelValue", { ...props.modelValue, enum: [...props.modelValue.enum, "value"] });
}

function updateEnumEntry(index: number, newContent: string) {
    const values = [...props.modelValue.enum];
    values[index] = newContent;
    emit("update:modelValue", { ...props.modelValue, enum: values });
}

function removeEnumEntry(index: number) {
    const values = [...props.modelValue.enum];
    values.splice(index, 1);
    emit("update:modelValue", { ...props.modelValue, enum: values });
}

function addProperty() {
    const properties = { ...props.modelValue.properties };
    let name = "newProperty";
    let counter = 1;
    while (properties[name] != undefined) {
        name = `newProperty${counter++}`;
    }
    properties[name] = defaultValueForType("string");
    emit("update:modelValue", { ...props.modelValue, properties });
}

function renameProperty(oldName: string, newName: string) {
    if (oldName === newName || !newName) {
        return;
    }
    const entries = Object.entries(props.modelValue.properties);
    if (entries.some(([name]) => name === newName)) {
        return;
    }
    // rebuild instead of delete + re-add to keep the position of the renamed property stable
    const properties = Object.fromEntries(
        entries.map(([name, value]) => (name === oldName ? [newName, value] : [name, value]))
    );
    emit("update:modelValue", { ...props.modelValue, properties });
}

function removeProperty(name: string) {
    const properties = { ...props.modelValue.properties };
    delete properties[name];
    emit("update:modelValue", { ...props.modelValue, properties });
}

function updateProperty(name: string, value: any) {
    emit("update:modelValue", { ...props.modelValue, properties: { ...props.modelValue.properties, [name]: value } });
}
</script>

<style scoped>
.name-input {
    max-width: 300px;
}

.type-select {
    max-width: 200px;
}

.property + .property {
    margin-top: 8px;
}

.nested {
    border-left: thin solid rgb(var(--v-theme-outline-variant));
    padding-left: 20px;
    margin-left: 8px;
    margin-top: 8px;
    transition: border-color 0.2s ease;
}

.nested:hover {
    border-left-color: rgba(var(--v-theme-primary), 0.5);
}
</style>
