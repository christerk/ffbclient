import * as Comp from '.';

export class HorizontalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        super.redrawChildren();
        let bounds = this.getBounds();
        let offSet: number = (bounds.x) / this.ctx.scale;
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
            };
            c.setPositionOffset(offSet);
            c.setContext(renderContext);
            c.redraw();
            offSet += (c.getWidthForParent() ) / this.ctx.scale;
        }

        if (super.shouldAdjustSize()) {
            this.config.width = offSet - baseOffset;
            if (super.triggerRedraw()) {
                for (let c of this.children) {
                    c.setAllowHitAreaCalculation(true);
                    c.redraw();
                }
            }
        }
        this.shape = new Phaser.Geom.Rectangle(bounds.x, bounds.y, (offSet - baseOffset) * this.ctx.scale, bounds.height)

    }

    public calculateHitArea(): void {
        this.container.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1, 1), Phaser.Geom.Rectangle.Contains);
        this.container.input.hitArea = this.shape;

    }
}