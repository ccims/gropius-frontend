import { VNode } from "snabbdom";
import { svg } from "sprotty";
import { Point } from "sprotty-protocol";

export function wrapForeignElement(element: VNode | undefined, offset: Point): VNode {
    return svg(
        "foreignObject",
        {
            attrs: {
                width: "99999",
                height: "99999",
                ...offset
            }
        },
        element
    );
}
