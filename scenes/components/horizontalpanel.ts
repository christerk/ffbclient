import * as Comp from '.';

export class HorizontalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        super.redrawChildren();
        let bounds = this.getBounds();
        let offSet: number = bounds.x;
        let baseOffset: number = offSet;
        for (let c of this.children) {
            if (super.triggerRedraw()) {
                c.setAllowHitAreaCalculation(false);
            }
            let renderContext: Comp.RenderContext = {
                scene: this.ctx.scene,
                parent: this,
                x: offSet,
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
        }

        if (super.shouldAdjustSize()) {
            this.config.width = super.pxToSize(offSet - baseOffset);
            if (super.triggerRedraw()) {
                for (let c of this.children) {
                    c.setAllowHitAreaCalculation(true);
                    c.redraw();
                }
            }
        }
        this.shape = new Phaser.Geom.Rectangle(bounds.x, bounds.y,offSet - baseOffset, bounds.height)

    }

    public calculateHitArea(): void {
        this.container.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1, 1), Phaser.Geom.Rectangle.Contains);
        this.container.input.hitArea = this.shape;

    }
}