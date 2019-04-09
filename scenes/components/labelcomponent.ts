import * as Comp from ".";
import {Size} from ".";
import {EventType} from "../../types";
import * as Core from "../../core";

export class Label extends Comp.UIComponent {
    private text: string;
    private textObject: Phaser.GameObjects.Text;
    private stroke: number;
    private fontSize: number;
    private numRows: number;
    private background: Phaser.GameObjects.Image;
    public container: Phaser.GameObjects.Container;
    private controller: Core.Controller;

    public constructor(config: Comp.ComponentConfiguration, controller: Core.Controller = null) {
        super(config);
        this.controller = controller;

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

        let controller = this.controller;

        if (this.config.event) {
            if (controller) {
                let event = this.config.event;
                this.addPointerUp(function () {
                    controller.triggerEvent(event);
                });
            } else {
               console.error(`Label ${this.config.id} has event ${event} configured but no controller is set.`)
            }
        }

        return this.container;
    }

    public destroy(): void {
        if (this.textObject != null) {
            this.textObject.destroy();
        }
        if (this.background != null) {
            this.background.destroy();
        }

        this.container.destroy();
    }

    public show() {
        this.container.visible = true;
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
        let fontSize = Math.floor((bounds.height - this.translateScalarHeight(this.config.padding.top) - this.translateScalarHeight(this.config.padding.bottom)) * 0.9) / rows;
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
            bounds = this.getBounds();
        }

        if (this.background != null) {
            this.container.remove(this.background);
        }
        if (this.config.background != null) {
            this.background = super.createBackground(bounds);
            this.container.addAt(this.background, 0);
        }
        this.textObject.setPosition(bounds.x + this.translateScalarWidth(this.config.padding.left), bounds.y + this.translateScalarHeight(this.config.padding.top))
    }

    public calculateHitArea(): void {
        super.calculateHitArea();
        let bounds = this.getBounds();
        this.container.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1, 1),
            Phaser.Geom.Rectangle.Contains);
        this.container.input.hitArea = new Phaser.Geom.Rectangle(bounds.x, bounds.y, bounds.width + this.horizontalPadding(), bounds.height + this.verticalPadding());
    }

    protected getInputElements(): Phaser.GameObjects.GameObject[] {
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
            this.background.width = this.translateScalarWidth(width);
        }
        return super.adjustWidthToParent(width);
    }

    public adjustHeightToParent(height: Size) {
        if (this.background) {
            this.background.height = this.translateScalarHeight(height);
        }
        return super.adjustHeightToParent(height);
    }
}
