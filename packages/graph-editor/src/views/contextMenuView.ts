import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { IView, RenderingContext, html, svg } from "sprotty";
import { SContextMenu } from "../smodel/sContextMenu.js";
import { SRoot } from "../smodel/sRoot.js";

@injectable()
export class ContextMenuView implements IView {
    render(model: Readonly<SContextMenu>, context: RenderingContext, args?: {} | undefined): VNode | undefined {
        const pos = model.pos;
        const zoom = (model.root as SRoot).zoom;
        return svg(
            "g",
            {
                attrs: {
                    transform: `translate(${pos.x}, ${pos.y}) scale(${1 / zoom})`
                }
            },
            svg(
                "foreignObject",
                {
                    attrs: {
                        width: "100vw",
                        height: "100vh"
                    }
                },
                html("div", {
                    class: {
                        "context-menu": true
                    }
                })
            )
        );
    }
}
