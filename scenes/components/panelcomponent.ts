import * as Comp from ".";

export abstract class Panel extends Comp.UIComponent {
    protected background: Phaser.GameObjects.Image;
    public children: Comp.UIComponent[];

    public container: Phaser.GameObjects.Container


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

    public clearChildren() {
        for (let child of this.children) {
            child.destroy();
        }
        this.children = [];
    }

    public create(): Phaser.GameObjects.GameObject {
        let bounds = this.getBounds();
        this.container = this.ctx.scene.make.container({});
        this.container.setPosition(0, 0);

        if (this.config.background != null) {
            this.background = super.createBackground(bounds);
            this.container.add(this.background)
        }

        let childCtx: Comp.RenderContext = {
            scene: this.ctx.scene,
            parent: this,
            x: bounds.x,
            y: bounds.y,
            w: bounds.width,
            h: bounds.height,
            scale: this.ctx.scale,
            offset: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }
        };

        for (let c of this.children) {
            c.setContext(childCtx);
            let childGameObject = c.create();
            this.container.add(childGameObject);
        }

        return this.container;
    }

    public destroy(): void {
        this.clearChildren();
        if (this.background != null) {
            this.background.destroy();
        }
    }

    public postCreate() {
        super.postCreate();

        for (let c of this.children) {
            c.postCreate();
        }
                }

    public show() {
        this.container.visible = true;
    }

    public hide() {
        this.container.visible = false;
    }

            public setVisible(visible: boolean) {
                    if (this.config.visible != visible) {
                        super.setVisible(visible);

                        for (let c of this.children) {
                            if (c.InheritVisibility) {
                    c.setVisible(visible);
                }
            }
        }
    }

    public setAllowHitAreaCalculation(isAllowed: boolean): void {
        super.setAllowHitAreaCalculation(isAllowed);
        for (let c of this.children) {
            c.setAllowHitAreaCalculation(isAllowed);
        }
    }

    protected getInputElements(): Phaser.GameObjects.GameObject[] {
        return [this.container];
    }
}