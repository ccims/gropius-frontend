import { injectable } from "inversify";
import type { VNode } from "snabbdom";
import { type IView, type RenderingContext, html } from "sprotty";
import { SChip } from "../smodel/sChip.js";

@injectable()
export class ChipView implements IView {
    render(model: Readonly<SChip>, context: RenderingContext, args?: {} | undefined): VNode | undefined {
        return html(
            "span",
            {
                class: { chip: true }
            },
            model.text
        );
    }
}
