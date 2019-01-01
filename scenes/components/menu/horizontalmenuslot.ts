import * as Comp from '..';
import Phaser from "phaser";

export class HorizontalMenuSlot extends Comp.HorizontalPanel {

    private label: Comp.Label;
    private panel: Comp.HorizontalPanel;

    public constructor(config: Comp.ComponentConfiguration, label: Comp.Label, panel: Comp.HorizontalPanel) {
        super(config);
        this.children = [];
        this.children.push(label, panel);
        this.label = label;
        this.panel = panel;
    }

    public create(): Phaser.GameObjects.GameObject {
        let container = super.create();

        let panel = this.panel;

        this.label.addHoverIn(function() {
            panel.setVisible(true);
        });

        this.label.addHoverOut(function() {
            panel.setVisible(false);
        });
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