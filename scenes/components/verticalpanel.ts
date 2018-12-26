import * as Comp from '.';
import {UIComponent} from ".";

export class VerticalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        super.redrawChildren();
        let bounds = this.getBounds(this.ctx);
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
                h: bounds.height,
                scale: this.ctx.scale,
            };
            c.setPositionOffset(0, offSet);
            c.setContext(renderContext);
            c.redraw();
            newWidth = Math.max( c.getWidthForParent() / this.ctx.scale, newWidth);
            offSet += c.getBounds(renderContext).height / this.ctx.scale;
            childNumber++;
        }



        if (super.shouldAdjustSize() && this.children.length > 0) {
            this.config.width = newWidth;
            this.config.height = offSet;
            for (let c of this.childrenToAdjust()) {
                c.adjustWidthToParent(newWidth)
                if (super.triggerRedraw()) {
                    c.redraw();
                }
            }
        }

        if (this.isInteractive) {
            bounds = this.getBounds(this.ctx);
           // let shape = this.getBounds(this.ctx);
            /*shape.width = shape.width * 2
            shape.x = shape.x + 100*/
            let shape = new Phaser.Geom.Rectangle(bounds.x, bounds.y, newWidth * this.ctx.scale, offSet * this.ctx.scale)
            console.log("DEBUG: Setting interactive: " + this.config.id + " with " + JSON.stringify(shape))
            this.container.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
            console.log("DEBUG: HitArea: " + JSON.stringify(this.container.input.hitArea));
        }
    }

    protected childrenToAdjust(): UIComponent[] {
        return this.children;
    }
}