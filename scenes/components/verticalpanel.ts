import * as Comp from '.';

export class VerticalPanel extends Comp.LinearPanel {

    protected renderChildren(bounds: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle {
        let childNumber = 0;
        let newWidth = 0;
        let offSet = 0;
        for (let c of this.children) {
            let renderContext: Comp.RenderContext = {
                scene: this.ctx.scene,
                parent: this,
                x: bounds.x,
                y: bounds.y,
                w: bounds.width,
                h: 100,
                scale: this.ctx.scale,
            };
            c.setPositionOffset(0, offSet)
            c.setContext(renderContext);
            c.redraw();
            let newBounds = c.getBounds(renderContext);
            newWidth = Math.max(newBounds.width / this.ctx.scale, newWidth);
            offSet += newBounds.height / this.ctx.scale;
            childNumber++;
        }

        if (super.shouldAdjustSize() && newWidth > 0) {
            this.config.width = newWidth;
        }

        return this.getBounds(this.ctx);
    }
}