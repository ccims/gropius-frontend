import type { ShapeStyle } from "../gropiusModel.js";
import type { Selectable } from "./selectable.js";

export interface IssueAffected extends Selectable {
    style: ShapeStyle;
    x: number;
    y: number;
}
