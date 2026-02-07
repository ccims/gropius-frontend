<template>
    <div :class="['node-wrapper', { 'container-node': node?.type === 'container' || node?.type === 'property' }]">
        <template v-if="node?.type === 'primitive'">
            <div class="mr-10">
                <v-select
                    :model-value="node.kind"
                    @update:model-value="updatePrimitiveType"
                    :items="primitiveTypes"
                    density="compact"
                    hide-details
                    variant="outlined"
                    class="mx-1"
                    style="width: 150px"
                ></v-select>
            </div>
        </template>

        <template v-else-if="node?.type === 'enum'">
            <div class="d-flex flex-column align-start py-1">
                <EditableCard
                    v-for="(entry, index) in node.values"
                    :key="index"
                    :content="entry"
                    color="secondary"
                    variant="tonal"
                    prepend-icon="mdi-circle-medium"
                    @confirm="(payload) => updateEnumEntry(index as number, payload.content)"
                    @delete="removeEnumEntry(index as number)"
                >
                </EditableCard>
                <v-btn prepend-icon="mdi-plus" variant="text" size="small" @click="addEnumEntry">Add Enum Entry</v-btn>
            </div>
        </template>

        <template v-if="node?.type === 'list'">
            <div class="list-node-wrapper">
                <div class="d-flex align-center mb-2">
                    <span class="text-caption mr-2">Element type:</span>
                    <v-menu>
                        <template v-slot:activator="{ props: menuProps }">
                            <v-chip
                                v-bind="menuProps"
                                size="small"
                                :prepend-icon="getIconForNode(node.elementType)"
                                variant="outlined"
                            >
                                {{ getNodeTypeLabel(node.elementType) }}
                            </v-chip>
                        </template>
                        <v-list density="compact">
                            <v-list-item @click="changeListElementType('primitive')">
                                <template v-slot:prepend><v-icon size="small">mdi-cube-outline</v-icon></template>
                                <v-list-item-title>Primitive</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeListElementType('enum')">
                                <template v-slot:prepend><v-icon size="small">mdi-list-status</v-icon></template>
                                <v-list-item-title>Enum</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeListElementType('container')">
                                <template v-slot:prepend><v-icon size="small">mdi-folder-outline</v-icon></template>
                                <v-list-item-title>Container</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeListElementType('list')">
                                <template v-slot:prepend
                                    ><v-icon size="small">mdi-format-list-bulleted</v-icon></template
                                >
                                <v-list-item-title>List</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeListElementType('map')">
                                <template v-slot:prepend><v-icon size="small">mdi-code-braces</v-icon></template>
                                <v-list-item-title>Map</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeListElementType('property')">
                                <template v-slot:prepend><v-icon size="small">mdi-cog-outline</v-icon></template>
                                <v-list-item-title>Property</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
                <TemplatedFieldSpecificationsValueBox
                    :rawNode="node.elementType"
                    :model-value="modelValue?.elements"
                    @update:model-value="updateListElementValue"
                />
            </div>
        </template>

        <template v-else-if="node?.type === 'map'">
            <div class="map-node-wrapper">
                <div class="d-flex align-center mb-2">
                    <span class="text-caption mr-2">Value type:</span>
                    <v-menu>
                        <template v-slot:activator="{ props: menuProps }">
                            <v-chip
                                v-bind="menuProps"
                                size="small"
                                :prepend-icon="getIconForNode(node.valueType)"
                                variant="outlined"
                            >
                                {{ getNodeTypeLabel(node.valueType) }}
                            </v-chip>
                        </template>
                        <v-list density="compact">
                            <v-list-item @click="changeMapValueType('primitive')">
                                <template v-slot:prepend><v-icon size="small">mdi-cube-outline</v-icon></template>
                                <v-list-item-title>Primitive</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeMapValueType('enum')">
                                <template v-slot:prepend><v-icon size="small">mdi-list-status</v-icon></template>
                                <v-list-item-title>Enum</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeMapValueType('container')">
                                <template v-slot:prepend><v-icon size="small">mdi-folder-outline</v-icon></template>
                                <v-list-item-title>Container</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeMapValueType('list')">
                                <template v-slot:prepend
                                    ><v-icon size="small">mdi-format-list-bulleted</v-icon></template
                                >
                                <v-list-item-title>List</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeMapValueType('map')">
                                <template v-slot:prepend><v-icon size="small">mdi-code-braces</v-icon></template>
                                <v-list-item-title>Map</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="changeMapValueType('property')">
                                <template v-slot:prepend><v-icon size="small">mdi-cog-outline</v-icon></template>
                                <v-list-item-title>Property</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
                <TemplatedFieldSpecificationsValueBox
                    :rawNode="node.valueType"
                    :model-value="modelValue?.values"
                    @update:model-value="updateMapValueValue"
                />
            </div>
        </template>

        <template v-else-if="node?.type === 'container'">
            <div
                v-for="childEntry in node.children"
                :key="childEntry.name"
                :class="['mb-4', { 'd-flex align-center': childEntry.node.type === 'primitive' }]"
            >
                <EditableCard
                    class="flex-grow-1"
                    :key="childEntry.name"
                    :content="childEntry.name"
                    :prepend-icon="getIconForNode(childEntry.node)"
                    :editable="childEntry.node.type !== 'property'"
                    @confirm="(payload) => renameChild(childEntry.name, payload.content)"
                    @delete="removeChild(childEntry.name)"
                >
                </EditableCard>

                <TemplatedFieldSpecificationsValueBox
                    :rawNode="childEntry.node"
                    :model-value="modelValue[childEntry.name]"
                    @update:model-value="(newValue) => updateChildValue(childEntry.name, newValue)"
                />
            </div>

            <div class="add-child-trigger">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <IconButton
                            v-bind="props"
                            variant="elevated"
                            icon="mdi-plus"
                            size="small"
                            color="primary"
                        ></IconButton>
                    </template>
                    <v-list density="compact">
                        <v-list-item @click="addChild('primitive')">
                            <template v-slot:prepend><v-icon size="small">mdi-cube-outline</v-icon></template>
                            <v-list-item-title>Primitive</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addChild('enum')">
                            <template v-slot:prepend><v-icon size="small">mdi-list-status</v-icon></template>
                            <v-list-item-title>Enum</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addChild('container')">
                            <template v-slot:prepend><v-icon size="small">mdi-folder-outline</v-icon></template>
                            <v-list-item-title>Container</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addChild('list')">
                            <template v-slot:prepend><v-icon size="small">mdi-format-list-bulleted</v-icon></template>
                            <v-list-item-title>List</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addChild('map')">
                            <template v-slot:prepend><v-icon size="small">mdi-code-braces</v-icon></template>
                            <v-list-item-title>Map</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addChild('property')">
                            <template v-slot:prepend><v-icon size="small">mdi-cog-outline</v-icon></template>
                            <v-list-item-title>Property</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </template>

        <template v-else-if="node?.type === 'property'">
            <div
                v-for="childEntry in node.children"
                :key="childEntry.name"
                :class="['mb-4', { 'd-flex align-center': childEntry.node.type === 'primitive' }]"
            >
                <EditableCard
                    class="flex-grow-1"
                    :key="childEntry.name"
                    :content="childEntry.name"
                    :prepend-icon="getIconForNode(childEntry.node)"
                    :editable="childEntry.node.type !== 'property'"
                    @confirm="(payload) => renamePropertyChild(childEntry.name, payload.content)"
                    @delete="removePropertyChild(childEntry.name)"
                >
                </EditableCard>

                <TemplatedFieldSpecificationsValueBox
                    :rawNode="childEntry.node"
                    :model-value="modelValue.properties[childEntry.name]"
                    @update:model-value="(newValue) => updatePropertyChildValue(childEntry.name, newValue)"
                />
            </div>

            <div class="add-child-trigger">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <IconButton
                            v-bind="props"
                            variant="elevated"
                            icon="mdi-plus"
                            size="small"
                            color="primary"
                        ></IconButton>
                    </template>
                    <v-list density="compact">
                        <v-list-item @click="addPropertyChild('primitive')">
                            <template v-slot:prepend><v-icon size="small">mdi-cube-outline</v-icon></template>
                            <v-list-item-title>Primitive</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addPropertyChild('enum')">
                            <template v-slot:prepend><v-icon size="small">mdi-list-status</v-icon></template>
                            <v-list-item-title>Enum</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addPropertyChild('container')">
                            <template v-slot:prepend><v-icon size="small">mdi-folder-outline</v-icon></template>
                            <v-list-item-title>Container</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addPropertyChild('list')">
                            <template v-slot:prepend><v-icon size="small">mdi-format-list-bulleted</v-icon></template>
                            <v-list-item-title>List</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addPropertyChild('map')">
                            <template v-slot:prepend><v-icon size="small">mdi-code-braces</v-icon></template>
                            <v-list-item-title>Map</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addPropertyChild('property')">
                            <template v-slot:prepend><v-icon size="small">mdi-cog-outline</v-icon></template>
                            <v-list-item-title>Property</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { type JsonFieldInput } from "@/graphql/generated";
import EditableCard from "./EditableCard.vue";

type PrimitiveType =
    | "boolean"
    | "string"
    | "timestamp"
    | "float32"
    | "float64"
    | "int8"
    | "uint8"
    | "int16"
    | "uint16"
    | "int32"
    | "uint32";

interface PrimitiveNode {
    type: "primitive";
    kind: PrimitiveType;
}

interface EnumNode {
    type: "enum";
    values: string[];
}

interface ContainerNode {
    type: "container";
    children: { name: string; node: Node }[];
}

interface PropertyNode {
    type: "property";
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

type Node = PrimitiveNode | EnumNode | ContainerNode | PropertyNode | ListNode | MapNode;

const props = defineProps<{
    modelValue?: any;
    rawNode?: any;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: any): void;
    (e: "remove"): void;
}>();

const primitiveTypes: PrimitiveType[] = [
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
];

function getIconForNode(node: Node): string {
    switch (node.type) {
        case "container":
            return "mdi-folder-outline";
        case "property":
            return "mdi-cog-outline";
        case "enum":
            return "mdi-list-status";
        case "primitive":
            return "mdi-cube-outline";
        case "list":
            return "mdi-format-list-bulleted";
        case "map":
            return "mdi-code-braces";
        default:
            return "mdi-help-circle-outline";
    }
}

function addChild(type: "primitive" | "enum" | "container" | "list" | "map" | "property", primitiveKind: PrimitiveType = "string") {
    const modelValue = props.modelValue ?? {};
    
    let newName;
    if(type === "property"){
         newName = "properties";
    } else {
        newName = "newName";
        let counter = 1;
        while (modelValue[newName]) {
            newName = `newItem${counter++}`;
        }
    }

    let newValue: any = {};
    if (type === "primitive") {
        newValue = { type: primitiveKind };
    } else if (type === "enum") {
        newValue = { enum: [] };
    } else if (type === "container") {
        newValue = {};
    } else if (type === "list") {
        newValue = { elements: { type: "string" } };
    } else if (type === "map") {
        newValue = { values: { type: "string" } };
    } else if (type === "property") {
        newValue = { properties: {} };
    }

    emit("update:modelValue", { ...modelValue, [newName]: newValue });
}

function updatePrimitiveType(newType: PrimitiveType) {
    emit("update:modelValue", { ...props.modelValue, type: newType });
}

function addEnumEntry() {
    const values = [...(props.modelValue.enum ?? [])];
    values.push("newValue");
    emit("update:modelValue", { ...props.modelValue, enum: values });
}

function updateEnumEntry(index: number, newContent: string) {
    const values = [...(props.modelValue.enum ?? [])];
    values[index] = newContent;
    emit("update:modelValue", { ...props.modelValue, enum: values });
}

function removeEnumEntry(index: number) {
    const values = [...(props.modelValue.enum ?? [])];
    values.splice(index, 1);
    emit("update:modelValue", { ...props.modelValue, enum: values });
}

function getNodeTypeLabel(node: Node): string {
    switch (node.type) {
        case "primitive":
            return node.kind;
        case "enum":
            return "Enum";
        case "container":
            return "Container";
        case "property":
            return "Property";
        case "list":
            return "List";
        case "map":
            return "Map";
        default:
            return "Unknown";
    }
}

function createDefaultValueForType(type: "primitive" | "enum" | "container" | "list" | "map" | "property"): any {
    switch (type) {
        case "primitive":
            return { type: "string" };
        case "enum":
            return { enum: [] };
        case "container":
            return {};
        case "list":
            return { elements: { type: "string" } };
        case "map":
            return { values: { type: "string" } };
        case "property":
            return { properties: {} };
    }
}

function changeListElementType(type: "primitive" | "enum" | "container" | "list" | "map" | "property") {
    emit("update:modelValue", { ...props.modelValue, elements: createDefaultValueForType(type) });
}

function updateListElementValue(newValue: any) {
    emit("update:modelValue", { ...props.modelValue, elements: newValue });
}

function changeMapValueType(type: "primitive" | "enum" | "container" | "list" | "map" | "property") {
    emit("update:modelValue", { ...props.modelValue, values: createDefaultValueForType(type) });
}

function updateMapValueValue(newValue: any) {
    emit("update:modelValue", { ...props.modelValue, values: newValue });
}

function renameChild(oldName: string, newName: string) {
    if (oldName === newName || !newName) return;
    const modelValue = { ...props.modelValue };
    if (modelValue[newName] !== undefined) return;

    modelValue[newName] = modelValue[oldName];
    delete modelValue[oldName];
    emit("update:modelValue", modelValue);
}

function removeChild(name: string) {
    const modelValue = { ...props.modelValue };
    delete modelValue[name];
    emit("update:modelValue", modelValue);
}

function updateChildValue(name: string, newValue: any) {
    const modelValue = { ...props.modelValue };
    modelValue[name] = newValue;
    emit("update:modelValue", modelValue);
}

function addPropertyChild(type: "primitive" | "enum" | "container" | "list" | "map" | "property", primitiveKind: PrimitiveType = "string") {
    const properties = props.modelValue?.properties ?? {};
    let newName;
    if(type === "property"){
         newName = "properties";
    } else {
        newName = "newName";
        let counter = 1;
        while (properties[newName]) {
            newName = `newItem${counter++}`;
        }
    }

    let newValue: any = {};
    if (type === "primitive") {
        newValue = { type: primitiveKind };
    } else if (type === "enum") {
        newValue = { enum: [] };
    } else if (type === "container") {
        newValue = {};
    } else if (type === "list") {
        newValue = { elements: { type: "string" } };
    } else if (type === "map") {
        newValue = { values: { type: "string" } };
    } else if (type === "property") {
        newValue = { properties: {} };
    }

    emit("update:modelValue", { ...props.modelValue, properties: { ...properties, [newName]: newValue } });
}

function renamePropertyChild(oldName: string, newName: string) {
    if (oldName === newName || !newName) return;
    const properties = { ...props.modelValue.properties };
    if (properties[newName] !== undefined) return;

    properties[newName] = properties[oldName];
    delete properties[oldName];
    emit("update:modelValue", { ...props.modelValue, properties });
}

function removePropertyChild(name: string) {
    const properties = { ...props.modelValue.properties };
    delete properties[name];
    emit("update:modelValue", { ...props.modelValue, properties });
}

function updatePropertyChildValue(name: string, newValue: any) {
    const properties = { ...props.modelValue.properties };
    properties[name] = newValue;
    emit("update:modelValue", { ...props.modelValue, properties });
}

const node = computed(() => {
    let processedNode: Node;
    if (props.rawNode?.type) {
        processedNode = JSON.parse(JSON.stringify(props.rawNode));
    } else {
        processedNode = processNode(props.rawNode);
    }

    if (processedNode.type === "container" || processedNode.type === "property") {
        const typeWeights: Record<string, number> = {
            primitive: 0,
            enum: 1,
            list: 2,
            map: 3,
            container: 4,
            property: 5
        };
        processedNode.children.sort((a, b) => typeWeights[a.node.type] - typeWeights[b.node.type]);
    }
    return processedNode;
});

function processNode(rawNode: any): Node {
    if ("type" in rawNode && typeof rawNode.type === "string") {
        return {
            type: "primitive",
            kind: rawNode.type as PrimitiveType
        };
    }

    if ("enum" in rawNode) {
        return {
            type: "enum",
            values: rawNode.enum
        };
    }

    if ("elements" in rawNode) {
        return {
            type: "list",
            elementType: processNode(rawNode.elements)
        };
    }

    if ("values" in rawNode) {
        return {
            type: "map",
            valueType: processNode(rawNode.values)
        };
    }

    if ("properties" in rawNode) {
        const propertyChildren = Object.entries(rawNode.properties)
            .filter(([key]) => key !== "nullable" && key !== "__typename")
            .map(([key, value]) => {
                return {
                    name: key,
                    node: processNode(value)
                };
            });

        propertyChildren.sort((a, b) => {
            const typeWeights: Record<string, number> = {
                primitive: 0,
                enum: 1,
                list: 2,
                map: 3,
                container: 4,
                property: 5
            };
            return typeWeights[a.node.type] - typeWeights[b.node.type];
        });

        return {
            type: "property",
            children: propertyChildren
        };
    }

    const children = Object.entries(rawNode)
        .filter(([key]) => key !== "nullable" && key !== "__typename")
        .map(([key, value]) => {
            return {
                name: key,
                node: processNode(value)
            };
        });

    children.sort((a, b) => {
        const typeWeights: Record<string, number> = {
            primitive: 0,
            enum: 1,
            list: 2,
            map: 3,
            container: 4,
            property: 5
        };
        return typeWeights[a.node.type] - typeWeights[b.node.type];
    });

    return {
        type: "container",
        children
    };
}
</script>

<style scoped>
.node-wrapper {
    margin-left: 16px;
    position: relative;
}

.container-node {
    border-left: 1.5px dashed rgba(var(--v-border-color), 0.4);
    padding-left: 20px;
    margin-top: 12px;
    margin-bottom: 24px;
    transition: border-color 0.2s ease;
}

.add-child-trigger {
    position: relative;
    margin-top: 4px;
    margin-left: -30px;
    z-index: 1;
}

.container-node:hover {
    border-left-color: rgba(var(--v-theme-primary), 0.5);
}

.list-node-wrapper,
.map-node-wrapper {
    padding-left: 8px;
    margin-top: 4px;
}
</style>
