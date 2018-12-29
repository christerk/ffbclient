import * as Comp from ".";
import * as Core from "../../core";
import { EventType } from "../../types";

export class Button extends Comp.UIComponent {
    private controller: Core.Controller;
    private button: Phaser.GameObjects.Image;

    public constructor(config: Comp.ComponentConfiguration, controller: Core.Controller) {
        super(config);

        this.controller = controller;
    }

    public create(): Phaser.GameObjects.GameObject {
        let bounds = this.getBounds();

        let g = this.ctx.scene.make.graphics({});
        g.fillStyle(this.config.background, 1);
        g.fillRect(0, 0, 100, 100);

        let key = 'ui:button:'+this.config.id;
        g.generateTexture(key, bounds.width, bounds.height);

        let button = new Phaser.GameObjects.Image(this.ctx.scene, 0, 0, key);

        button.setOrigin(0, 0);
        button.setPosition(bounds.x, bounds.y);
        button.setInteractive();

        button.on('pointerdown', (pointer) => {
            this.controller.triggerEvent(EventType.Click, { source: this.config.id });
        });

        this.button = button;
        return button;
    }

    public destroy(): void {
        this.button.destroy();
    }

    public show() {
        this.button.visible = true;
    }

    public hide() {
        this.button.visible = false;
    }

    public redrawSelfBeforeChildren(): void {
        super.redrawSelfBeforeChildren();
        let bounds = this.getBounds();
        this.button.setPosition(bounds.x, bounds.y);
        this.button.setDisplaySize(bounds.width, bounds.height);
    }
}
