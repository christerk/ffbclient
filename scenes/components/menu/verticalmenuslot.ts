import * as Comp from '..';
import Phaser from "phaser";
import {MenuService} from "./menuservice";

export class VerticalMenuSlot extends Comp.VerticalPanel implements Comp.MenuSlot {

    public label: Comp.Label;
    public panel: Comp.VerticalPanel;
    public parentPanel: Comp.VerticalPanel;
    private menuService = new MenuService();

    public constructor(config: Comp.ComponentConfiguration, label: Comp.Label, panel: Comp.VerticalPanel) {
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
        return this.children[0].adjustWidthToParent(width);
    }

    public getWidthForParent(): number {
        if (this.children.length > 0) {
            return this.children[0].getWidthForParent();
        }
        return 0;
    }

    public childrenToAdjust(): Comp.UIComponent[] {
        let childrenCount = this.children.length
        return this.children.slice(Math.min(1), childrenCount);
    }
}