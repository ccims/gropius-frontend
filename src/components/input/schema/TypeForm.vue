<template>
    <v-text-field v-if="isString || isNumber" v-model="cachedValue" :rules="rules" :label="name" />
</template>
<script setup lang="ts">
import { Schema, SchemaFormType } from "jtd";
import { computed, ref } from "vue";
import { PropType } from "vue";
import { Rule, ifPresent, requiredRule } from "./rules";
import { watch } from "vue";
import { parseValue } from "graphql";

const props = defineProps({
    schema: {
        type: Object as PropType<SchemaFormType>,
        required: true
    },
    rootSchema: {
        type: Object as PropType<Schema>,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    modelValue: {
        required: false
    }
});

const emit = defineEmits({
    "update:modelValue": (value: any) => true
});

const cachedValue = ref(props.modelValue);

watch(
    () => props.modelValue,
    (value) => {
        if (isNumber) {
            const asFloat = Number.parseFloat(cachedValue.value as string);
            if (value == undefined) {
                if (cachedValue.value) {
                    cachedValue.value = undefined;
                }
            } else if (value != asFloat) {
                if (!Number.isNaN(asFloat) || (cachedValue.value as string).trim() != "NaN") {
                    cachedValue.value = value.toString();
                }
            }
        } else {
            if (value != cachedValue.value) {
                cachedValue.value = value;
            }
        }
    }
);

watch(cachedValue, (value) => {
    let parsedValue: null | undefined | string | number | boolean = undefined;
    if (isNumber) {
        const parsedFloat = Number.parseFloat(value as string);
        if (!Number.isNaN(parsedFloat) || (value as string).trim() == "NaN") {
            parsedValue = parsedFloat;
        }
    } else if (isString) {
        parsedValue = value as string;
    } else if (isBoolean) {
        parsedValue = value as boolean;
    } else if (isTimestamp) {
        parsedValue = value as string;
    }
    if (parsedValue !== undefined) {
        emit("update:modelValue", parsedValue);
    }
})

const isNumber = computed(() => {
    const type = props.schema.type;
    return (
        type === "float32" ||
        type === "float64" ||
        type === "int8" ||
        type === "int16" ||
        type === "int32" ||
        type === "uint8" ||
        type === "uint16" ||
        type === "uint32"
    );
});

const isString = computed(() => {
    const type = props.schema.type;
    return type === "string";
});

const isBoolean = computed(() => {
    const type = props.schema.type;
    return type === "boolean";
});

const isTimestamp = computed(() => {
    const type = props.schema.type;
    return type === "timestamp";
});

const isInteger = computed(() => {
    const type = props.schema.type;
    return (
        type === "int8" ||
        type === "int16" ||
        type === "int32" ||
        type === "uint8" ||
        type === "uint16" ||
        type === "uint32"
    );
});

const rules = computed(() => {
    const rules: Rule[] = [];
    const type = props.schema.type;
    if (!props.schema.nullable) {
        rules.push(requiredRule);
    }

    if (isNumber.value) {
        rules.push(
            ifPresent((value) => {
                const trimmed = value.trim();
                const asFloat = Number.parseFloat(trimmed);
                if (Number.isNaN(asFloat) && trimmed !== "NaN") {
                    return "Must be a number";
                }
                return true;
            })
        );
    }
    if (isInteger.value) {
        rules.push(ifPresent((value: string) => Number.isInteger(Number(value)) || "Must be an integer"));
    }
    if (type === "int8") {
        rules.push(validateNumber(-128, 127));
    } else if (type === "int16") {
        rules.push(validateNumber(-32768, 32767));
    } else if (type === "int32") {
        rules.push(validateNumber(-2147483648, 2147483647));
    } else if (type === "uint8") {
        rules.push(validateNumber(0, 255));
    } else if (type === "uint16") {
        rules.push(validateNumber(0, 65535));
    } else if (type === "uint32") {
        rules.push(validateNumber(0, 4294967295));
    }
    return rules;
});

function validateNumber(min: number, max: number): Rule {
    return ifPresent((value: string) => {
        const trimmed = value.trim();
        const asInt = Number.parseInt(trimmed);
        if (Number.isNaN(asInt)) {
            return true;
        }
        if (asInt < min || asInt > max) {
            return `Out of range [${min}, ${max}]`;
        }
        return true;
    });
}
</script>