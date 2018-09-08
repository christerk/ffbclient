import * as Comp from '.';

export class LinearPanel extends Comp.Panel {

    public redraw(): void {
        super.redraw();

        let bounds = this.getBounds(this.ctx);

        if (this.config.layout == Comp.Layout.Border) {
            this.renderChildrenBorderLayout(bounds);
        } else if (this.config.layout == Comp.Layout.HorizontalList) {
            this.renderChildrenHorizontalLayout(bounds);
        } else if (this.config.layout == Comp.Layout.VerticalList) {
            this.renderChildrenVerticalLayout(bounds);
        } else {
            console.log("Invalid layout value: " + this.config.layout)
        }
        bounds = this.getBounds(this.ctx);
        let bg = this.background;
        if (bg != null) {
            bg.setPosition(bounds.x, bounds.y);
            bg.setDisplaySize(bounds.width, bounds.height);
        }
    }
}