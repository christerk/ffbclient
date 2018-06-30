import Phaser from "phaser";
import * as Comp from "../components";

export class UILayer {
    public group: Phaser.GameObjects.Container;
    private parent: Phaser.Scene;

    private components: Comp.UIComponent[];

    public constructor(parent: Phaser.Scene) {
        this.parent = parent;
        this.group = parent.make.container({});

        this.components = [];

        this.components.push(new Comp.UIComponent({
            x: 0,
            y: 0,
            width: 1,
            height: 0.05,
            anchor: Comp.Anchor.NORTH,
            parentAnchor: Comp.Anchor.NORTH,
            background: 0x003300
        }));

        this.components.push(new Comp.Label({
            x: 0,
            y: 0,
            width: 0.1,
            height: 0.05,
            anchor: Comp.Anchor.NORTH,
            parentAnchor: Comp.Anchor.NORTH,
            background: 0x003300,
            text: 'TEST TEXT'
        }));

        this.redraw();
    }

    public redraw() {
        let w = this.parent.sys.canvas.clientWidth;
        let h = this.parent.sys.canvas.clientHeight;

        this.components.map((c) => c.graphic = null);
        this.group.removeAll(true);
        for (let c of this.components) {
            let g = c.render(this.parent, w, h);
            this.group.add(g);
        }
    }

}