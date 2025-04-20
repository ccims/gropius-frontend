import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { IView, RenderingContext, html, svg } from "sprotty";
import { SContextMenu } from "../smodel/sContextMenu.js";

@injectable()
export class ContextMenuView implements IView {
    render(model: Readonly<SContextMenu>, context: RenderingContext, args?: {} | undefined): VNode | undefined {
        const pos = model.pos;

        return svg(
            "g",
            {
                style: {
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(calc(1 / var(--diagram-zoom)))`
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
