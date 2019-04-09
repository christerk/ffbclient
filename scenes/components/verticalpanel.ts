import * as Comp from '.';
import {UIComponent} from ".";

export class VerticalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        super.redrawChildren();
        let bounds = this.getBounds();
        let childNumber = 0;
        let newWidth = 0;
        let offSet = 0;

        for (let c of this.children) {
            if (super.triggerRedraw()) {
                c.setAllowHitAreaCalculation(false);
            }

            let renderContext: Comp.RenderContext = {
                scene: this.ctx.scene,
                parent: this,
                x: bounds.x,
                y: bounds.y,
                w: bounds.width,
                h: bounds.height,
                scale: this.ctx.scale,
                offset: {
                    left: 0,
                    top:  super.pxToSize(offSet),
                    right: 0,
                    bottom: 0

                }
            };
            c.setContext(renderContext);
            c.redraw();
            newWidth = Math.max( c.getWidthForParent(), newWidth);
            offSet += c.getHeightForParent();
            childNumber++;
        }

        if (super.shouldAdjustSize() && this.children.length > 0) {
            this.config.width = super.pxToSize(newWidth);
            this.config.height = super.pxToSize(offSet);
            for (let c of this.childrenToAdjust()) {
                c.adjustWidthToParent(super.pxToSize(newWidth));
                if (super.triggerRedraw()) {
                    c.setAllowHitAreaCalculation(true);
                    c.redraw();
                }
            }
        }
    }
}