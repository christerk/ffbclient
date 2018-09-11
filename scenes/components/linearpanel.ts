import * as Comp from '.';

export abstract class LinearPanel extends Comp.Panel {

    public redraw(): void {
        super.redraw();
        let bounds = this.renderChildren(this.getBounds(this.ctx));
        this.createBackground(bounds);
    }

    private createBackground(bounds) {
        let bg = this.background;
        if (bg != null) {
            bg.setPosition(bounds.x, bounds.y);
            bg.setDisplaySize(bounds.width, bounds.height);
        }
    }

    protected shouldAdjustSize(): boolean {
        return this.config.visible && this.config.adjustSize;
    }

    protected abstract renderChildren(bounds: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
}
