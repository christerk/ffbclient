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
            };
            c.setPositionOffset(0, offSet);
            c.setContext(renderContext);
            c.redraw();
            newWidth = Math.max( c.getWidthForParent() / this.ctx.scale, newWidth);
            offSet += c.getBoundsForContext(renderContext).height / this.ctx.scale;
            childNumber++;
        }



        if (super.shouldAdjustSize() && this.children.length > 0) {
            this.config.width = newWidth;
            this.config.height = offSet;
            for (let c of this.childrenToAdjust()) {
                c.adjustWidthToParent(newWidth);
                if (super.triggerRedraw()) {
                    c.setAllowHitAreaCalculation(true);
                    c.redraw();
                }
            }
        }

        bounds = this.getBounds();
        this.shape = new Phaser.Geom.Rectangle(bounds.x, bounds.y, newWidth * this.ctx.scale, offSet * this.ctx.scale)

    }

    protected childrenToAdjust(): UIComponent[] {
        return this.children;
    }

    public calculateHitArea(): void {

        if (this.isInteractive) {
            // let shape = this.getBounds();
            /*shape.width = shape.width * 2
            shape.x = shape.x + 100*/
            console.log("DEBUG: Setting interactive: " + this.config.id + " with " + JSON.stringify(this.shape))
            this.container.setInteractive(this.shape, Phaser.Geom.Rectangle.Contains);
            console.log("DEBUG: HitArea: " + JSON.stringify(this.container.input.hitArea));
        }
    }
}