import * as Comp from '.';

export abstract class LinearPanel extends Comp.Panel {

    protected shape: Phaser.Geom.Rectangle

    public redrawSelfAfterChildren() {
        super.redrawSelfAfterChildren();
        let bounds = this.getBounds();
        let bg = this.background;
        if (bg != null) {
            bg.setPosition(bounds.x, bounds.y);
            bg.setDisplaySize(bounds.width, bounds.height);
        }
    }

    protected shouldAdjustSize(): boolean {
        return this.config.adjustSize;
    }

    protected triggerRedraw(): boolean {
        return this.config.triggerRecursiveRedrawAfterAdjust;
    }
}
