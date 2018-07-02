import * as Comp from ".";
import Controller from "../../controller";
import { EventType } from "../../types";

export class Button extends Comp.UIComponent {
    private controller: Controller;

    public constructor(config: Comp.ComponentConfiguration, controller: Controller) {
        super(config);

        this.controller = controller;
    }

    public render(ctx: Comp.RenderContext): Phaser.GameObjects.GameObject {
        let bounds = this.getBounds(ctx);

        let g = ctx.scene.make.graphics({});
        g.fillStyle(this.config.background, 1);
        g.fillRect(0, 0, bounds.width, bounds.height);

        let key = 'ui:button:'+this.config.id;
        g.generateTexture(key, bounds.width, bounds.height);

        let button = ctx.scene.make.image({
            key: key
        });

        button.setOrigin(0, 0);
        button.setPosition(bounds.x, bounds.y);
        button.setInteractive();

        button.on('pointerdown', (pointer) => {
            this.controller.triggerEvent(EventType.Click, { source: this.config.id });
        });

        return button;
    }
}
