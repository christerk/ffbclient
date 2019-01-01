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
        this.container.on("pointerover", function (pointer: Phaser.Input.Pointer) {
            console.log("DEBUG: OVER VSLot: " +" at x=" + pointer.x + ", y=" + pointer.y)
        });

        this.panel.container.on("pointerover", function (pointer: Phaser.Input.Pointer) {
            console.log("DEBUG: OVER VPanel: " + " at x=" + pointer.x + ", y=" + pointer.y)
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

 /*   public redrawChildren(): void {
        for (let c of this.children){
            c.redrawChildren()
        }
    }*/

    public redraw() {
        super.redraw();
     //   this.container.setInteractive();
       // (this.children[1] as VerticalPanel).show();
       /* this.container.on("pointerover", function (pointer: Phaser.Input.Pointer) {
            console.log("DEBUG: OVER VSlot: " + self.config.id)
        });*/

    }

}