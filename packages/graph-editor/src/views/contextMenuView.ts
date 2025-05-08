import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { IView, RenderingContext, html, svg } from "sprotty";
import { SContextMenu } from "../smodel/sContextMenu.js";
import { SRoot } from "../smodel/sRoot.js";
import { wrapForeignElement } from "./util.js";
import { Math2D } from "../line/math.js";

@injectable()
export class ContextMenuView implements IView {
    render(model: Readonly<SContextMenu>, context: RenderingContext, args?: {} | undefined): VNode | undefined {
        const pos = model.pos;
        const root = model.root as SRoot;
        return wrapForeignElement(
            html("div", {
                class: {
                    "context-menu": true
                }
            }),
            Math2D.scale(Math2D.sub(pos, root.scroll), root.zoom)
        );
    }
}
