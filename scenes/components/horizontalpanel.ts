import * as Comp from '.';

export class HorizontalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        super.redrawChildren();
        let bounds = this.getBounds(this.ctx);
        let offSet: number = bounds.x / this.ctx.scale;
        for (let c of this.children) {
            let renderContext: Comp.RenderContext = {
                scene: this.ctx.scene,
                parent: this,
                x: offSet,
                y: bounds.y,
                w: bounds.width,
                h: bounds.height,
                scale: this.ctx.scale,
            };
            c.setPositionOffset(offSet);
            c.setContext(renderContext);
            c.redraw();
            offSet += c.getBounds(renderContext).width / this.ctx.scale
        }

        if (super.shouldAdjustSize()) {
            this.config.width = offSet;
            if (super.triggerRedraw()) {
                for (let c of this.children) {
                    c.redraw();
                }
            }
        }

    }
}