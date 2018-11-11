import * as Comp from '.';

export class HorizontalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        super.redrawChildren();
        let bounds = this.getBounds(this.ctx);
        let offSet: number = bounds.x / this.ctx.scale;
        var index = 0;
        for (let c of this.children) {
            console.log("DEBUG: offset " +  offSet + " of child[" +  index++ + "]")
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
        console.log("DEBUG: offset " +  offSet + " of child[" +  index + "]")
        console.log("DEBUG: Width: " + this.getBounds(this.ctx).width + " of " + this.config.id )


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