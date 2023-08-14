import { Bounds, Dimension, Point } from "sprotty-protocol";
import { ShapeStyle, StrokeStyle } from "../../gropiusModel";
import { Shape } from "../shape";
import { ShapeEngine } from "./shapeEngine";
import { ArcSegment } from "../../line/model/arcSegment";
import { Line } from "../../line/model/line";
import { Math2D } from "../../line/math";

export class EllipseEngine extends ShapeEngine {
    override generateForBounds(bounds: Bounds, style: ShapeStyle): Shape {
        const strokeWidth = StrokeStyle.strokeWidth(style);
        const sqrt2half = Math.sqrt(2) / 2;
        const borderSize = this.calculate45DegreeStrokeVector(bounds, strokeWidth);
        const innerSize = {
            width: sqrt2half * bounds.width - 2 * borderSize.x,
            height: sqrt2half * bounds.height - 2 * borderSize.y
        };
        const center = Bounds.center(bounds);
        return {
            bounds,
            innerBounds: {
                ...innerSize,
                x: center.x - innerSize.width / 2,
                y: center.y - innerSize.height / 2
            },
            shape: "ellipse",
            outline: this.outline(center, bounds.width - strokeWidth / 2, bounds.height - strokeWidth / 2)
        };
    }

    override generateForInnerBounds(bounds: Bounds, style: ShapeStyle): Shape {
        const strokeWidth = StrokeStyle.strokeWidth(style);
        const sqrt2half = Math.sqrt(2) / 2;
        const borderSize = this.calculate45DegreeStrokeVector(bounds, strokeWidth);
        const outerSize = {
            width: (bounds.width + 2 * borderSize.x) / sqrt2half,
            height: (bounds.height + 2 * borderSize.y) / sqrt2half
        };
        const center = Bounds.center(bounds);
        return {
            bounds: {
                ...outerSize,
                x: center.x - outerSize.width / 2,
                y: center.y - outerSize.height / 2
            },
            innerBounds: bounds,
            shape: "ellipse",
            outline: this.outline(center, outerSize.width / 2 - strokeWidth / 2, outerSize.height / 2 - strokeWidth / 2)
        };
    }

    protected outline(center: Point, rx: number, ry: number): Line {
        const width = rx * 2;
        const height = ry * 2;
        const startPos = {
            x: center.x - rx,
            y: center.y
        };
        const segments = [{ x: center.x + rx, y: center.y }, startPos].map((endPos) => ({
            type: ArcSegment.TYPE,
            radiusX: width / 2,
            radiusY: height / 2,
            center,
            clockwise: true,
            end: endPos
        }));
        return {
            start: startPos,
            segments: segments
        };
    }

    private calculate45DegreeStrokeVector(size: Dimension, strokeWidth: number): Point {
        if (strokeWidth === 0) {
            return Point.ORIGIN;
        }
        const sqrt2half = Math.sqrt(2) / 2;
        const dx = size.width / 2;
        const dy = size.height / 2;
        const nx = (dy * sqrt2half) / Math.sqrt(dy ** 2 / 2 + dx ** 2 / 2);
        const ny = (dx * sqrt2half) / Math.sqrt(dy ** 2 / 2 + dx ** 2 / 2);
        return Math2D.scaleTo({ x: nx, y: ny }, strokeWidth);
    }
}
