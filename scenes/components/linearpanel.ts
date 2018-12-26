import * as Comp from '.';

export abstract class LinearPanel extends Comp.Panel {

    public  isInteractive : boolean = false

    public redrawSelfAfterChildren() {
        super.redrawSelfAfterChildren();
        let bounds = this.getBounds(this.ctx);
        let bg = this.background;
        if (bg != null) {
            bg.setPosition(bounds.x, bounds.y);
            bg.setDisplaySize(bounds.width, bounds.height);
        }

    }

    protected shouldAdjustSize(): boolean {
        return this.config.visible && this.config.adjustSize;
    }

    protected triggerRedraw(): boolean {
        return this.config.triggerRecursiveRedrawAfterAdjust;
    }
}
