import * as Comp from ".";

export class BorderPanel extends Comp.Panel {

    public redrawChildren(): void {
        let bounds = this.getBounds();

        let renderContext: Comp.RenderContext = {
            scene: this.ctx.scene,
            parent: this,
            x: bounds.x,
            y: bounds.y,
            w: bounds.width,
            h: bounds.height,
            scale: this.ctx.scale,
            offset: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }
        };

        for (let c of this.children) {
            c.setContext(renderContext);
            c.redraw();
        }
    }
    public redrawSelfAfterChildren(): void {
        let bounds = this.getBounds();

        let bg = this.background;
        if (bg != null) {
            bg.setPosition(bounds.x, bounds.y);
            bg.setDisplaySize(bounds.width, bounds.height);
        }
    }

}