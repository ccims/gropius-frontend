import { Bounds } from "sprotty-protocol";
import { Line } from "../line/model/line.js";
import type { Shape as GropiusShape } from "../gropiusModel.js";

export interface Shape {
    bounds: Bounds;
    shape: GropiusShape;
    outline: Line;
}
