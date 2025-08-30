import { injectable } from "inversify";
import { BoundsAware, SModelElementImpl, HiddenBoundsUpdater as SprottyHiddenBoundsUpdater } from "sprotty";
import { Bounds } from "sprotty-protocol";

@injectable()
export class HiddenBoundsUpdater extends SprottyHiddenBoundsUpdater {
    protected override getBounds(elm: Node, element: SModelElementImpl & BoundsAware): Bounds {
        if (this.isSVGGraphicsElement(elm)) {
            return super.getBounds(elm, element);
        }
        if (this.isHtmlElement(elm)) {
            if (elm.classList.contains("label")) {
                const spanBounds = (elm.firstChild as HTMLElement).getBoundingClientRect();
                const divBounds = elm.getBoundingClientRect();
                return {
                    x: spanBounds.x,
                    y: divBounds.y,
                    width: spanBounds.width,
                    height: divBounds.height
                };
            }
            return elm.getBoundingClientRect();
        } else {
            this.logger.error(this, `Cannot get bounds for element`, elm);
            return Bounds.EMPTY;
        }
    }

    private isSVGGraphicsElement(node: Node): node is SVGGraphicsElement {
        return typeof (node as SVGGraphicsElement).getBBox === "function";
    }

    private isHtmlElement(node: Node): node is HTMLElement {
        return "getBoundingClientRect" in node;
    }
}
