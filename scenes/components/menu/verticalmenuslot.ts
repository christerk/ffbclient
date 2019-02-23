import * as Comp from '..';
import {UIComponent, VerticalPanel} from "..";
import Phaser from "phaser";

export class VerticalMenuSlot extends Comp.VerticalPanel implements Comp.MenuSlot {

    private label: Comp.Label;
    private panel: Comp.VerticalPanel;
    public parentSlot: Comp.MenuSlot;
    private childHoverCount = 0;

    public constructor(config: Comp.ComponentConfiguration, label: Comp.Label, panel: Comp.VerticalPanel) {
        super(config);
        this.children = [];
        this.children.push(label, panel);
        this.label = label;
        this.panel = panel;
    }

    public create(): Phaser.GameObjects.GameObject {
        let container = super.create();
        let label = this.label;
        let panel = this.panel;

        let self = this;
        label.addHoverIn(function() {
            panel.setVisible(true);
            panel.calculateHitArea();
            self.childSlotHoverIn();
        });

        label.addHoverOut(function(pointer: Phaser.Input.Pointer) {
            //TODO refer to hit area instead of bounds
            let bounds = self.label.getBounds();
            if (pointer.y < bounds.y + bounds.height) {
                panel.setVisible(false);
                self.container.disableInteractive();
            }

            self.childSlotHoverOut();

        });

        panel.addHoverIn(function() {
            self.childSlotHoverIn();
        });

        panel.addHoverOut(function(pointer: Phaser.Input.Pointer) {
            if (!panel.getBounds().contains(pointer.x, pointer.y)) {
                panel.setVisible(false);
                self.container.disableInteractive();
            }
            self.childSlotHoverOut();
        });

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

    public childSlotHoverIn() {
        this.childHoverCount ++;
        this.panel.setVisible(true);
        if(this.parentSlot) {
            this.parentSlot.childSlotHoverIn()
        }
    }

    public childSlotHoverOut() {
        this.childHoverCount --;
        if (this.childHoverCount == 0) {
            this.panel.setVisible(false);
        }
        if(this.parentSlot) {
            this.parentSlot.childSlotHoverOut()
        }
    }

}