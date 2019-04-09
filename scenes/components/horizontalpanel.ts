import * as Comp from '.';

export class HorizontalPanel extends Comp.LinearPanel {
    public redrawChildren(): void {
        super.redrawChildren();
        let bounds = this.getBounds();
        let offSet: number = bounds.x;
        let baseOffset: number = offSet;
        let newHeight: number = 0;
        for (let c of this.children) {
            if (super.triggerRedraw()) {
                c.setAllowHitAreaCalculation(false);
            }
            let renderContext: Comp.RenderContext = {
                scene: this.ctx.scene,
                parent: this,
                x: 0,
                y: bounds.y,
                w: bounds.width,
                h: bounds.height,
                scale: this.ctx.scale,
                offset: {
                    left: super.pxToSize(offSet),
                    top: 0,
                    right: 0,
                    bottom: 0
                }
            };
            c.setContext(renderContext);
            c.redraw();
            offSet += c.getWidthForParent();
            newHeight = Math.max(c.getHeightForParent(), newHeight);
        }

        if (super.shouldAdjustSize()) {
            this.config.width = super.pxToSize(offSet - baseOffset);
            this.config.height = super.pxToSize(newHeight);
             for (let c of this.childrenToAdjust()) {
                c.adjustHeightToParent(super.pxToSize(newHeight));
                if (super.triggerRedraw()) {
                    c.setAllowHitAreaCalculation(true);
                    c.redraw();
                }
            }
        }
    }
}