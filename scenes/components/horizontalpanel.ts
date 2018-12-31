import * as Comp from '.';

export class HorizontalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        super.redrawChildren();
        let bounds = this.getBounds();
        let offSet: number = (bounds.x) / this.ctx.scale;
        let baseOffset: number = offSet;
        var index = 0;
        for (let c of this.children) {
            if (super.triggerRedraw()) {
                c.setAllowHitAreaCalculation(false);
            }
            console.log("DEBUG: Scaled offset " +  offSet * this.ctx.scale + " of child[" +  index + "]")
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
            console.log("DEBUG: Child Width: " + c.getBoundsForContext(renderContext).width + " of child[" + index + "]")
            console.log("DEBUG: Parent Width: " + this.getBounds().width + " of " + this.config.id )
            index ++;
        }
        console.log("DEBUG: Scaled offset " +  offSet * this.ctx.scale + " of child[" +  index + "]")
        console.log("DEBUG: Parent Width: " + this.getBounds().width + " of " + this.config.id )


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
        if (this.isInteractive) {
            let bounds = this.getBounds();
            // let shape = this.getBounds();
            /*shape.width = shape.width * 2
            shape.x = shape.x + 100*/
            console.log("DEBUG: Setting interactive: " + this.config.id + " with " + JSON.stringify(this.shape))
            this.container.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1, 1), Phaser.Geom.Rectangle.Contains);
            this.container.input.hitArea = this.shape;
            console.log("DEBUG: HitArea: " + JSON.stringify(this.container.input.hitArea));
        }
    }
}