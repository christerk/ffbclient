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
        let additionalOffset = this.label.adjustWidthToParent(width);
        this.panel.adjustLeftPositionOffset(additionalOffset);
        return additionalOffset;
    }

    public adjustHeightToParent(height: Comp.Size): number {
        return this.label.adjustHeightToParent(height);
    }

    public getWidthForParent(): number {
        return this.label.getWidthForParent();
    }

    public getHeightForParent(): number {
        return this.label.getHeightForParent();
    }

    public childrenToAdjust(): Comp.UIComponent[] {
        let childrenCount = this.children.length;
        return this.children.slice(Math.min(1), childrenCount);
    }
}