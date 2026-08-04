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

export function derefSchemaRecursive(schema: Schema, rootSchema: Schema): Schema {
    if (isRefForm(schema)) {
        return derefSchemaRecursive(rootSchema.definitions![schema.ref], rootSchema);
    }
    return schema;
}

export function generateDefaultData(schema: Schema, rootSchema: Schema, ignoreNullable = false): any {
    const derefSchema = derefSchemaRecursive(schema, rootSchema);
    if (derefSchema.nullable && !ignoreNullable) {
        return null;
    } else if (isElementsForm(derefSchema)) {
        return [];
    } else if (isValuesForm(derefSchema)) {
        return {};
    } else if (isDiscriminatorForm(derefSchema)) {
        return { [derefSchema.discriminator]: undefined };
    } else if (isTypeForm(schema)) {
        return null;
    } else if (isEnumForm(schema)) {
        return null;
    } else if (isPropertiesForm(schema)) {
        return Object.fromEntries(
            Object.entries(schema.properties ?? {}).map(([key, value]) => [key, generateDefaultData(value, rootSchema)])
        );
    } else {
        throw new Error("Unknown schema form");
    }
}
