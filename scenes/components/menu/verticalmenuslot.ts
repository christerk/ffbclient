import * as Comp from '..';
import {UIComponent, VerticalPanel} from "..";
import Phaser from "phaser";

export class VerticalMenuSlot extends Comp.VerticalPanel {

    private label: Comp.Label;
    private panel: Comp.VerticalPanel;

    public constructor(config: Comp.ComponentConfiguration, label: Comp.Label, panel: Comp.VerticalPanel) {
        super(config);
        this.children = [];
        this.children.push(label, panel);
        this.label = label;
        this.panel = panel;
    }

    public create(): Phaser.GameObjects.GameObject {
        let container = super.create();

        let panel = this.panel;

        let self = this;
        this.label.addHoverIn(function() {
            panel.setVisible(true);
            panel.calculateHitArea();
        });

        this.label.addHoverOut(function(pointer: Phaser.Input.Pointer) {
            //TODO refer to hit area instead of bounds
            let bounds = self.label.getBounds();
            if (pointer.y < bounds.y + bounds.height) {
                panel.setVisible(false);
                self.container.disableInteractive();
            }
        });

        this.panel.addHoverOut(function() {
            panel.setVisible(false);
            self.container.disableInteractive();
        })

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

    public childrenToAdjust(): UIComponent[] {
        let childrenCount = this.children.length
        return this.children.slice(Math.min(1), childrenCount);
    }
}