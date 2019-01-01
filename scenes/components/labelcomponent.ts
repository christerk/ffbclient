import * as Comp from ".";
import {Size} from ".";

export class Label extends Comp.UIComponent {
    private text: string;
    private textObject: Phaser.GameObjects.Text;
    private stroke: number;
    private fontSize: number;
    private numRows: number;
    private background: Phaser.GameObjects.Image;
    private container: Phaser.GameObjects.Container;

    public constructor(config: Comp.ComponentConfiguration) {
        super(config);

        this.config.adjustSize = true;

        this.text = config.text;
        this.stroke = 0;
        this.fontSize = -1;
        this.numRows = this.text ? this.text.split("\n").length : 1;
    }

    public create(): Phaser.GameObjects.GameObject {
        this.container = this.ctx.scene.make.container({});
        this.container.setPosition(0, 0);

        this.textObject = this.ctx.scene.make.text({});
        this.textObject.setFontFamily("arial");
        if (this.stroke > 0) {
            this.textObject.setStroke("#000000", this.stroke);
        }

        this.container.add(this.textObject);

        return this.container;
    }

    public destroy(): void {
        if (this.textObject) {
            this.textObject.destroy();
        }
        if (this.background != null) {
            this.background.destroy();
        }

        this.container.destroy();
    }

    public show() {
        this.container.visible = true;
        let self = this;
        this.container.on("pointerover", function (pointer) {
            console.log("DEBUG: Pointer over labwel: " + self.config.id + " at x=" + pointer.x + " y=" + pointer.y)
        });
    }

    public hide() {
        this.container.visible = false;
    }

    public redrawSelfBeforeChildren(): void {
        super.redrawSelfBeforeChildren();

        let col = this.numberToRGBString(this.config.color);

        let bounds = this.getBounds();
        let g = this.textObject;

        let rows = this.numRows;
        if (rows < 1) {
            rows = 1;
        }
        let fontSize = Math.floor(bounds.height * 0.9) / rows;
        if (fontSize != this.fontSize) {
            g.setFontSize(fontSize);
            this.fontSize = fontSize;
        }
        g.setColor(col);
        if (g.text != this.text) {
            g.setText(this.text);
        }

        if (this.config.adjustSize) {
            this.config.width = g.displayWidth + "px";
        }
        bounds = this.getBounds();
        if (this.background != null) {
            this.container.remove(this.background);
        }
        if (this.config.background != null) {
            this.background = super.createBackground(bounds);
            this.container.addAt(this.background, 0);
        }
        this.textObject.setPosition(bounds.x,bounds.y)
    }

    public calculateHitArea(): void {
        super.calculateHitArea()
        let bounds = this.getBounds();
        console.log("DEBUG: Label setting shape: " + JSON.stringify(bounds) + " for label " + this.config.id);
        this.container.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1, 1),
            Phaser.Geom.Rectangle.Contains);
        this.container.input.hitArea = new Phaser.Geom.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
        console.log("DEBUG: Label has hit area: " + JSON.stringify(this.container.input.hitArea) + " for label " + this.config.id)

    }

    protected getHoverElements(): Phaser.GameObjects.GameObject[] {
        return [this.container];
    }

    public setStroke(width: number) {
        this.stroke = width;
    }

    public setText(text: string) {
        this.text = text;

        let g = this.textObject;
        if (g && text != null) {
            this.numRows = text.split("\n").length;
            g.setText(text);
            this.config.width = g.displayWidth + "px";
            let bounds = this.getBounds();
            g.setPosition(bounds.x, bounds.y);
        }
    }

    public adjustWidthToParent(width: Size) {
        if (this.background) {
            this.background.width = this.translateScalar(width, this.ctx.scale, this.ctx.w);
        }
        return super.adjustWidthToParent(width);
    }
}
