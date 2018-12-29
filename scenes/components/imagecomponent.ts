import * as Comp from ".";

export class Image extends Comp.UIComponent {
    private image: Phaser.GameObjects.Image;

    public constructor(config: Comp.ComponentConfiguration) {
        super(config);
    }

    public create(): Phaser.GameObjects.GameObject {
        this.image = new Phaser.GameObjects.Image(this.ctx.scene, 0, 0, "null");
        return this.image;
    }

    public destroy(): void {
        this.image.destroy();
    }

    public show() {
        this.image.setVisible(true);
    }

    public hide() {
        this.image.setVisible(false);
    }

    public setImage(key: string) {
        this.image.setTexture(key);
    }

    public redrawSelfBeforeChildren(): void {
        super.redrawSelfBeforeChildren();
        let bounds = this.getBounds();
        this.image.setOrigin(0, 0);
        this.image.setPosition(bounds.x, bounds.y);
        this.image.setDisplaySize(bounds.width, bounds.height);
    }
}
