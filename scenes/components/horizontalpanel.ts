import * as Comp from '.';

export class HorizontalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        console.log("DEBUG: Entering RedrawChildren of " + this.config.id)
        super.redrawChildren();
        let bounds = this.getBounds(this.ctx);
        let offSet: number = bounds.x / this.ctx.scale;
        let baseOffset: number = offSet;
        var index = 0;
        for (let c of this.children) {
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
            offSet += c.getBounds(renderContext).width / this.ctx.scale;
            console.log("DEBUG: Child Width: " + c.getBounds(renderContext).width + " of child[" + index + "]")
            console.log("DEBUG: Parent Width: " + this.getBounds(this.ctx).width + " of " + this.config.id )
            index ++;
        }
        console.log("DEBUG: Scaled offset " +  offSet * this.ctx.scale + " of child[" +  index + "]")
        console.log("DEBUG: Parent Width: " + this.getBounds(this.ctx).width + " of " + this.config.id )


        if (super.shouldAdjustSize()) {
            this.config.width = offSet - baseOffset;
            if (super.triggerRedraw()) {
                for (let c of this.children) {
                    c.redraw();
                }
            }
        }
        console.log("DEBUG: Leaving RedrawChildren of " + this.config.id)
    }
}