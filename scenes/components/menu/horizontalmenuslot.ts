import * as Comp from '..';
import Phaser from "phaser";
import {MenuService} from "./menuservice";

export class HorizontalMenuSlot extends Comp.HorizontalPanel implements Comp.MenuSlot {

    public label: Comp.Label;
    public panel: Comp.HorizontalPanel;
    public parentPanel: Comp.VerticalPanel;
    private menuService = new MenuService();

    public constructor(config: Comp.ComponentConfiguration, label: Comp.Label, panel: Comp.HorizontalPanel) {
        super(config);
        this.children = [];
        this.children.push(label, panel);
        this.label = label;
        this.panel = panel;
    }

    public create(): Phaser.GameObjects.GameObject {
        let container = super.create();
        this.menuService.setUpInteraction(this);
        return container;
    }

    public adjustWidthToParent(width: Comp.Size): number {
        let additionalOffset = this.children[0].adjustWidthToParent(width);
        for (let c of this.children.slice(1)) {
              c.adjustPositionOffset(additionalOffset/this.ctx.scale);
        }
        return additionalOffset;
    }

    public getWidthForParent(): number {
        if (this.children.length > 0) {
            return this.children[0].getWidthForParent();
        }
        return 0;
    }

    public redrawChildren(): void {
        super.redrawChildren();
    }
}