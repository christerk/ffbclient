import * as Comp from '.';

export class HorizontalPanel extends Comp.LinearPanel {

    protected renderChildren(bounds: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle {
            let offSet: number = bounds.x;
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
                c.setContext(renderContext);
                c.redraw();
                offSet += c.getBounds(renderContext).width / this.ctx.scale
            }

            if (super.shouldAdjustSize() && offSet != bounds.x) {
                this.config.width = offSet;
            }

            return this.getBounds(this.ctx);
        }
}