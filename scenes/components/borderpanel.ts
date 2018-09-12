import * as Comp from ".";

export class BorderPanel extends Comp.Panel {

    public redraw(): void {
        super.redraw();

        let bounds = this.getBounds(this.ctx);

        let renderContext: Comp.RenderContext = {
            scene: this.ctx.scene,
            parent: this,
            x: bounds.x,
            y: bounds.y,
            w: bounds.width,
            h: bounds.height,
            scale: this.ctx.scale,
        };

        for (let c of this.children) {
            c.setContext(renderContext);
            c.redraw();
        }

        let bg = this.background;
        if (bg != null) {
            bg.setPosition(bounds.x, bounds.y);
            bg.setDisplaySize(bounds.width, bounds.height);
        }
    }

}