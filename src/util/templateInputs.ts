import { MarkerType, ShapeType } from "@/gql/enums";
import type { FillStyleInput, JsonFieldInput, StrokeStyleInput } from "@/gql/graphql";

/** The state a create template dialog collects for one of the sub templates of the created template */
export interface SubTemplateState {
    name: string;
    description: string;
    templateFieldSpecifications: JsonFieldInput[];
}

export function emptySubTemplate(name: string): SubTemplateState {
    return { name, description: "", templateFieldSpecifications: [] };
}

/** The state a create template dialog collects for the appearance of the created template */
export interface TemplateStyleState {
    shapeType: ShapeType;
    shapeRadius: number | null;
    markerType: MarkerType;
    /** empty means no fill style */
    fillColor: string;
    /** empty means no stroke color */
    strokeColor: string;
    /** empty means a solid stroke */
    strokeDash: string;
}

export function defaultTemplateStyle(): TemplateStyleState {
    return {
        shapeType: ShapeType.Rect,
        shapeRadius: null,
        markerType: MarkerType.Arrow,
        fillColor: "",
        strokeColor: "",
        strokeDash: ""
    };
}

/**
 * Parses a dash pattern like `4, 4`, returns undefined if it is empty or not a list of numbers.
 */
export function parseStrokeDash(dash: string): number[] | undefined {
    const parts = dash
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
    if (parts.length == 0 || parts.some((part) => !isFinite(Number(part)))) {
        return undefined;
    }
    return parts.map((part) => Number(part));
}

export function fillStyleInput(style: TemplateStyleState): FillStyleInput | undefined {
    return style.fillColor ? { color: style.fillColor } : undefined;
}

export function strokeStyleInput(style: TemplateStyleState): StrokeStyleInput | undefined {
    const dash = parseStrokeDash(style.strokeDash);
    if (!style.strokeColor && dash == undefined) {
        return undefined;
    }
    return {
        color: style.strokeColor || undefined,
        dash
    };
}

/** Turns an enum value like FILLED_DIAMOND into "Filled diamond" */
export function humanizeEnumValue(value: string): string {
    const words = value.toLowerCase().replace(/_/g, " ");
    return words.charAt(0).toUpperCase() + words.slice(1);
}
