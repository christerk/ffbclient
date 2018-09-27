import * as Comp from '..';
import {RenderContext} from "../uicomponent";

export class MenuNode extends Comp.UIComponent {

    private delegate: Comp.LinearPanel;

    public getBounds(ctx: RenderContext): Phaser.Geom.Rectangle {
        return this.delegate.getBounds(ctx);
    }

    public redraw() {
        this.delegate.redraw();
    }

    create(): Phaser.GameObjects.GameObject {
        //return this.delegate.create();
        return null;
    }

    destroy(): void {
    }

    hide(): void {
        this.delegate.hide();
    }

    show(): void {
        this.delegate.show();
    }

}