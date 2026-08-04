import {
    type Schema,
    isDiscriminatorForm,
    isElementsForm,
    isEnumForm,
    isPropertiesForm,
    isRefForm,
    isTypeForm,
    isValuesForm
} from "jtd";

/**
 * Template field specifications are JSON Type Definition schemas, but they are read by users who do
 * not know JSON Type Definition. Every form is therefore described by a name, an icon and a sentence
 * instead of by its schema keyword, the keyword itself is only offered as additional information.
 */
export interface TemplateFieldTypeInfo {
    /** Name of the type, shown on the type chip */
    label: string;
    /** Plural of [label], used where the type is mentioned inside a sentence */
    plural: string;
    icon: string;
    /** Decides the color of the type chip */
    category: TemplateFieldTypeCategory;
    /** Sentence describing which values are allowed */
    hint: string;
    /** How the type is written in the schema itself */
    technical: string;
}

/**
 * Types with the same category share a color: a single value, a container of arbitrarily many
 * values, or a fixed structure.
 */
export type TemplateFieldTypeCategory = "primitive" | "collection" | "structure";

/**
 * A child of a schema in the type tree: a property of a group, the entry type of a list or map,
 * or one of the shapes of a discriminated union.
 */
export interface TemplateFieldSchemaChild {
    /** Name of the property, or the role of the child like "Every entry" */
    label: string;
    /** Whether [label] is a name taken from the schema instead of a fixed role */
    named: boolean;
    schema: Schema;
    /** Whether the property may be missing entirely */
    optional: boolean;
}

const anyTypeInfo: TemplateFieldTypeInfo = {
    label: "Anything",
    plural: "values of any type",
    icon: "mdi-help-circle-outline",
    category: "primitive",
    hint: "Any value is allowed",
    technical: "empty schema"
};

function integerTypeInfo(type: string, min: number, max: number): TemplateFieldTypeInfo {
    return {
        label: "Whole number",
        plural: "whole numbers",
        icon: "mdi-numeric",
        category: "primitive",
        hint: `A whole number from ${min.toLocaleString("en-US")} to ${max.toLocaleString("en-US")}`,
        technical: type
    };
}

function decimalTypeInfo(type: string, bits: number): TemplateFieldTypeInfo {
    return {
        label: "Decimal number",
        plural: "decimal numbers",
        icon: "mdi-decimal",
        category: "primitive",
        hint: `A number that may have decimal places, stored with ${bits} bit precision`,
        technical: type
    };
}

const primitiveTypeInfos: Record<string, TemplateFieldTypeInfo> = {
    string: {
        label: "Text",
        plural: "texts",
        icon: "mdi-format-text",
        category: "primitive",
        hint: "Any text",
        technical: "string"
    },
    boolean: {
        label: "Yes / No",
        plural: "yes / no values",
        icon: "mdi-toggle-switch-outline",
        category: "primitive",
        hint: "Either yes or no",
        technical: "boolean"
    },
    timestamp: {
        label: "Date & time",
        plural: "dates & times",
        icon: "mdi-calendar-clock",
        category: "primitive",
        hint: "A date with a time, written like 2024-08-04T15:30:00Z",
        technical: "timestamp"
    },
    float32: decimalTypeInfo("float32", 32),
    float64: decimalTypeInfo("float64", 64),
    int8: integerTypeInfo("int8", -128, 127),
    uint8: integerTypeInfo("uint8", 0, 255),
    int16: integerTypeInfo("int16", -32768, 32767),
    uint16: integerTypeInfo("uint16", 0, 65535),
    int32: integerTypeInfo("int32", -2147483648, 2147483647),
    uint32: integerTypeInfo("uint32", 0, 4294967295)
};

const formTypeInfos = {
    enum: {
        label: "Choice",
        plural: "choices",
        icon: "mdi-format-list-checks",
        category: "structure",
        hint: "One of a fixed set of options",
        technical: "enum"
    },
    elements: {
        label: "List",
        plural: "lists",
        icon: "mdi-format-list-bulleted",
        category: "collection",
        hint: "Any number of entries, all of the same type",
        technical: "elements"
    },
    values: {
        label: "Named entries",
        plural: "sets of named entries",
        icon: "mdi-table-key",
        category: "collection",
        hint: "Any number of entries, each with a freely chosen name",
        technical: "values"
    },
    properties: {
        label: "Group",
        plural: "groups",
        icon: "mdi-folder-outline",
        category: "structure",
        hint: "A fixed set of named fields",
        technical: "properties"
    },
    discriminator: {
        label: "One of",
        plural: "values of one of several shapes",
        icon: "mdi-call-split",
        category: "structure",
        hint: "One of several shapes, selected by one field",
        technical: "discriminator"
    }
} satisfies Record<string, TemplateFieldTypeInfo>;

/**
 * A type the field specification editor can create.
 * The editor builds its type select from these so that it names types like the rest of the app.
 */
export interface TemplateFieldTypeOption {
    /** The JTD type for primitives, the form keyword for everything else */
    value: string;
    info: TemplateFieldTypeInfo;
}

/**
 * The types offered by the field specification editor, in the order they are offered.
 * The forms the editor cannot build, like `discriminator`, are left out.
 */
export const templateFieldTypeOptions: TemplateFieldTypeOption[] = [
    ...[
        "string",
        "boolean",
        "timestamp",
        "int8",
        "uint8",
        "int16",
        "uint16",
        "int32",
        "uint32",
        "float32",
        "float64"
    ].map((type) => ({ value: type, info: primitiveTypeInfos[type] })),
    ...(["enum", "elements", "values", "properties"] as const).map((form) => ({
        value: form as string,
        info: formTypeInfos[form] as TemplateFieldTypeInfo
    }))
];

/**
 * Follows `ref`s until a schema of another form is reached.
 * Unknown and recursive references resolve to themselves so that callers always get a schema back.
 */
export function resolveTemplateFieldSchema(schema: Schema | undefined, rootSchema: Schema): Schema {
    let resolved: Schema = schema ?? {};
    const visited = new Set<string>();
    while (isRefForm(resolved)) {
        if (visited.has(resolved.ref)) {
            break;
        }
        visited.add(resolved.ref);
        const definition = rootSchema?.definitions?.[resolved.ref];
        if (definition == undefined) {
            break;
        }
        resolved = definition;
    }
    return resolved;
}

/**
 * How the type of the given schema is presented to the user.
 */
export function templateFieldTypeInfo(schema: Schema | undefined, rootSchema: Schema): TemplateFieldTypeInfo {
    const resolved = resolveTemplateFieldSchema(schema, rootSchema);
    if (isRefForm(resolved)) {
        return {
            ...anyTypeInfo,
            label: "Unknown",
            hint: `The schema refers to the definition "${resolved.ref}", which does not exist`,
            technical: `ref: ${resolved.ref}`
        };
    }
    if (isTypeForm(resolved)) {
        return primitiveTypeInfos[resolved.type] ?? anyTypeInfo;
    }
    if (isEnumForm(resolved)) {
        return { ...formTypeInfos.enum, hint: `One of ${resolved.enum.length} fixed options` };
    }
    if (isElementsForm(resolved)) {
        return formTypeInfos.elements;
    }
    if (isValuesForm(resolved)) {
        return formTypeInfos.values;
    }
    if (isDiscriminatorForm(resolved)) {
        return {
            ...formTypeInfos.discriminator,
            hint: `One of ${Object.keys(resolved.mapping).length} shapes, selected by the "${resolved.discriminator}" field`
        };
    }
    if (isPropertiesForm(resolved)) {
        const count = propertyCount(resolved);
        return {
            ...formTypeInfos.properties,
            hint: count == 1 ? "A group of one field" : `A group of ${count} fields`
        };
    }
    return anyTypeInfo;
}

/**
 * The options of a choice, undefined if the schema is not a choice.
 */
export function templateFieldSchemaOptions(schema: Schema | undefined, rootSchema: Schema): string[] | undefined {
    const resolved = resolveTemplateFieldSchema(schema, rootSchema);
    return isEnumForm(resolved) ? resolved.enum : undefined;
}

/**
 * The nested schemas shown below a schema in the type tree.
 */
export function templateFieldSchemaChildren(
    schema: Schema | undefined,
    rootSchema: Schema
): TemplateFieldSchemaChild[] {
    const resolved = resolveTemplateFieldSchema(schema, rootSchema);
    if (isElementsForm(resolved)) {
        return [{ label: "Every entry", named: false, schema: resolved.elements, optional: false }];
    }
    if (isValuesForm(resolved)) {
        return [{ label: "Every entry", named: false, schema: resolved.values, optional: false }];
    }
    if (isDiscriminatorForm(resolved)) {
        return Object.entries(resolved.mapping).map(([name, mappedSchema]) => ({
            label: `${resolved.discriminator} = ${name}`,
            named: true,
            schema: mappedSchema,
            optional: false
        }));
    }
    if (isPropertiesForm(resolved)) {
        return [
            ...Object.entries(resolved.properties ?? {}).map(([name, propertySchema]) => ({
                label: name,
                named: true,
                schema: propertySchema,
                optional: false
            })),
            ...Object.entries(resolved.optionalProperties ?? {}).map(([name, propertySchema]) => ({
                label: name,
                named: true,
                schema: propertySchema,
                optional: true
            }))
        ];
    }
    return [];
}

/**
 * Whether the schema has anything to show beyond its type, meaning it is worth expanding.
 */
export function hasTemplateFieldSchemaDetails(schema: Schema | undefined, rootSchema: Schema): boolean {
    return (
        templateFieldSchemaOptions(schema, rootSchema) != undefined ||
        templateFieldSchemaChildren(schema, rootSchema).length > 0
    );
}

/**
 * One line describing which values the schema allows, shown below the name of a field specification.
 */
export function describeTemplateFieldSpecification(schema: Schema | undefined, rootSchema: Schema): string {
    const resolved = resolveTemplateFieldSchema(schema, rootSchema);
    if (isEnumForm(resolved)) {
        return `One of: ${joinTruncated(resolved.enum)}`;
    }
    if (isElementsForm(resolved)) {
        return `A list of ${templateFieldTypeInfo(resolved.elements, rootSchema).plural}`;
    }
    if (isValuesForm(resolved)) {
        return `Entries with freely chosen names, each holding ${templateFieldTypeInfo(resolved.values, rootSchema).plural}`;
    }
    if (isDiscriminatorForm(resolved)) {
        return `Depending on "${resolved.discriminator}": ${joinTruncated(Object.keys(resolved.mapping))}`;
    }
    if (isPropertiesForm(resolved)) {
        const names = [...Object.keys(resolved.properties ?? {}), ...Object.keys(resolved.optionalProperties ?? {})];
        if (names.length == 0) {
            return "A group without any fields";
        }
        return `${names.length == 1 ? "1 field" : `${names.length} fields`}: ${joinTruncated(names)}`;
    }
    return templateFieldTypeInfo(resolved, rootSchema).hint;
}

/**
 * The description a schema documents itself with, JSON Type Definition puts those in `metadata`.
 */
export function templateFieldSchemaDescription(schema: Schema | undefined, rootSchema: Schema): string | undefined {
    const description = (resolveTemplateFieldSchema(schema, rootSchema).metadata as any)?.description;
    return typeof description === "string" && description.length > 0 ? description : undefined;
}

function propertyCount(schema: Schema): number {
    return (
        Object.keys((schema as any).properties ?? {}).length +
        Object.keys((schema as any).optionalProperties ?? {}).length
    );
}

function joinTruncated(values: string[], limit = 4): string {
    // listing one more value is shorter than announcing that one value is left out
    if (values.length <= limit + 1) {
        return values.join(", ");
    }
    return `${values.slice(0, limit).join(", ")} and ${values.length - limit} more`;
}
