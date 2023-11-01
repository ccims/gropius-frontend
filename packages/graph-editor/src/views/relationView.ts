import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { IView, RenderingContext, svg } from "sprotty";
import { SRelation } from "../smodel/sRelation";
import { Math2D } from "../line/math";
import { StrokeStyle } from "../gropiusModel";
import { MarkerGenerator } from "../marker/markerGenerator";
import { SLabel } from "../smodel/sLabel";

@injectable()
export class RelationView implements IView {
    render(model: Readonly<SRelation>, context: RenderingContext, args?: {} | undefined): VNode | undefined {
        const relationPath = model.path;
        if (relationPath == null) {
            return undefined;
        }
        const { start, end } = relationPath;
        let endVector = Math2D.sub(start, end);
        if (Math2D.length(endVector) == 0) {
            endVector = { x: 1, y: 0 };
        }
        const markerAngle = Math2D.angle(endVector) + Math.PI;
        const strokeWidth = StrokeStyle.strokeWidth(model.style);
        const pathStyle = {
            "stroke-width": strokeWidth,
            stroke: model.style.stroke?.color ?? "var(--shape-stroke-color)"
        };
        const markerInfo = MarkerGenerator.DEFAULT.getMarkerInfo(model.style);
        const markerStartPoint = Math2D.add(end, Math2D.scaleTo(endVector, markerInfo.startOffset));
        const endMarker = svg("path", {
            attrs: {
                d: markerInfo.path,
                ...pathStyle,
                transform: `translate(${markerStartPoint.x}, ${markerStartPoint.y}) rotate(${
                    (markerAngle * 180) / Math.PI
                })`,
                fill: markerInfo.filled ? pathStyle.stroke : "none"
            }
        });
        const lineEndPoint = Math2D.add(end, Math2D.scaleTo(endVector, markerInfo.startOffset - markerInfo.lineOffset));
        const pathPath = `M ${start.x} ${start.y} L ${lineEndPoint.x} ${lineEndPoint.y}`;
        const pathAttributes: Record<string, string | number> = {
            d: pathPath,
            ...pathStyle,
            fill: "none"
        };
        if (model.style.stroke?.dash != undefined) {
            pathAttributes["stroke-dasharray"] = model.style.stroke.dash.join(" ");
        }
        const path = svg("path", {
            attrs: pathAttributes
        });
        const hiddenPath = svg("path", {
            attrs: {
                d: pathPath
            },
            class: {
                "hidden-path": true
            }
        });
        const otherChildren: (VNode | undefined)[] = [];
        for (const child of model.children) {
            if (child instanceof SLabel) {
                // TODO
            }
        }
        return svg(
            "g",
            {
                class: {
                    selectable: true
                }
            },
            path,
            hiddenPath,
            endMarker,
            ...otherChildren
        );
    }
}
