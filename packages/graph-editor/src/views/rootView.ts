import { inject, injectable } from "inversify";
import { IView, IViewArgs, RenderingContext, svg, TYPES, ViewerOptions } from "sprotty";
import { SRoot } from "../smodel/sRoot.js";
import { VNode } from "snabbdom";
import { SContextMenu } from "../smodel/sContextMenu.js";

@injectable()
export class RootView implements IView {
    @inject(TYPES.ViewerOptions) protected options!: ViewerOptions;

    get backgroundPatternId(): string {
        return this.options.baseDiv + "-background-pattern";
    }

    render(model: Readonly<SRoot>, context: RenderingContext, _args?: IViewArgs | undefined): VNode {
        const transform = `scale(${model.zoom}) translate(${-model.scroll.x},${-model.scroll.y})`;
        const contextMenus = model.children.filter((child) => child instanceof SContextMenu) as SContextMenu[];
        const otherChildren = model.children.filter((child) => !(child instanceof SContextMenu));
        return svg(
            "svg",
            {
                ns: "http://www.w3.org/2000/svg",
                style: {
                    "--diagram-zoom": `${model.zoom}`,
                    "--diagram-scroll-x": `${model.scroll.x}px`,
                    "--diagram-scroll-y": `${model.scroll.y}px`
                }
            },
            svg("style", null, model.generateStyle()),
            svg("defs", null, this.renderBackgroundPattern(model)),
            this.renderBackground(),
            svg(
                "g",
                {
                    attrs: {
                        transform
                    },
                    class: {
                        "sprotty-root": true
                    }
                },
                ...otherChildren.map((child) => context.renderElement(child))
            ),
            ...contextMenus.map((menu) => context.renderElement(menu))
        );
    }

    private renderBackground(): VNode | undefined {
        return svg("rect", {
            attrs: {
                x: 0,
                y: 0,
                width: "100%",
                height: "100%",
                fill: `url(#${this.backgroundPatternId})`
            }
        });
    }

    private renderBackgroundPattern(model: Readonly<SRoot>): VNode | undefined {
        const zoomNormalized = model.zoom / Math.pow(3, Math.floor(Math.log(model.zoom) / Math.log(3)));
        const gridSize = 25 * zoomNormalized;
        return svg(
            "pattern",
            {
                attrs: {
                    id: this.backgroundPatternId,
                    width: gridSize,
                    height: gridSize,
                    x: (-model.scroll.x * model.zoom) % gridSize,
                    y: (-model.scroll.y * model.zoom) % gridSize,
                    patternUnits: "userSpaceOnUse"
                }
            },
            svg("circle.background-pattern", {
                attrs: {
                    cx: gridSize / 2,
                    cy: gridSize / 2,
                    r: 1
                }
            })
        );
    }
}
