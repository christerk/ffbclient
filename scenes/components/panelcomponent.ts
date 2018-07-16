import * as Comp from ".";

export class Panel extends Comp.UIComponent {
    private background: Phaser.GameObjects.Image;
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

    public create(): Phaser.GameObjects.GameObject {
        let bounds = this.getBounds(this.ctx);
        let container = this.ctx.scene.make.container({});
        container.setPosition(0, 0);

        if (this.config.background != null) {
            let bg = this.ctx.scene.make.graphics({});
            let alpha = this.config.backgroundAlpha;
            if (alpha === null || alpha === undefined) {
                alpha = 1;
            }
            bg.fillStyle(this.config.background, alpha);
            bg.fillRect(0, 0, bounds.width, bounds.height);
            let key = Comp.UIComponent.generateKey();
            bg.generateTexture(key, bounds.width, bounds.height);
            this.background = new Phaser.GameObjects.Image(this.ctx.scene, 0, 0, key);
            this.background.setOrigin(0,0);
            container.add(this.background);
        }

        let childCtx: Comp.RenderContext = {
            scene: this.ctx.scene,
            parent: this,
            x: bounds.x,
            y: bounds.y,
            w: bounds.width,
            h: bounds.height,
            scale: this.ctx.scale,
        };

        for (let c of this.children) {
            c.setContext(childCtx);
            let childGameObject = c.create();
            container.add(childGameObject);
        }

        return container;
    }

    public postCreate() {
        super.postCreate();

        for (let c of this.children) {
            c.postCreate();
        }
    }

    public show() {
        if (this.background != null) {
            this.background.visible = true;
        }
    }

    public hide() {
        if (this.background != null) {
            this.background.visible = false;
        }
    }

    public setVisible(visible: boolean, processChildren: boolean = true) {
        super.setVisible(visible);

        if (processChildren) {
            for (let c of this.children) {
                c.setVisible(visible);
            }
        }
    }

    public redraw(): void {
        super.redraw();

        let bounds = this.getBounds(this.ctx);

        let bg = this.background;
        if (bg != null) {
            bg.setPosition(bounds.x, bounds.y);
            bg.setDisplaySize(bounds.width, bounds.height);
        }

        let renderContext: Comp.RenderContext = {
            scene: this.ctx.scene,
            parent: this,
            x: bounds.x,
            y: bounds.y,
            w: bounds.width,
            h: bounds.height,
            scale: this.ctx.scale,
        };

        for (let c of this.children) {
            c.setContext(renderContext);
            let childGameObject = c.redraw();
        }
    }
}
