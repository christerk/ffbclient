import * as Comp from ".";

export class Panel extends Comp.UIComponent {
    private children: Comp.UIComponent[];

    public constructor(config: Comp.ComponentConfiguration) {
        super(config);

        this.children = [];

        if (config.children) {
            for (let child of config.children) {
                this.children.push(child);
            }
        }
    }

    public addChild(child: Comp.UIComponent) {
        this.children.push(child);
    }

    public render(ctx: Comp.RenderContext): Phaser.GameObjects.GameObject {
        let bounds = this.getBounds(ctx, true);
        console.log('panel bounds', bounds);

        if (!this.phaserObject) {
            this.phaserObject = ctx.scene.make.container({});
        }

        let container = <Phaser.GameObjects.Container> this.phaserObject;

        container.removeAll(true);
        this.children.map((c) => c.phaserObject = null);

        if (this.config.background != null) {
            let bg = ctx.scene.make.graphics({});
            bg.fillStyle(this.config.background, 1);
            bg.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            bg.setPosition(0, 0);
            container.add(bg);
        }
        container.setPosition(0, 0);

        console.log('panel children', this.children);
        for (let c of this.children) {
            let childGameObject = c.render({
                scene: ctx.scene,
                parent: this,
                x: bounds.x,
                y: bounds.y,
                w: bounds.width,
                h: bounds.height,
                scale: ctx.scale,
            });
            container.add(childGameObject);
        }

        return container;
    }
}
