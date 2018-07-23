import Phaser from "phaser";
import * as Core from "../../core";
import * as Model from "../../model";
import * as Layers from ".";
import * as Types from "../../types";

export class Ball extends Layers.Abstract {
    private ballIcon: Phaser.GameObjects.Graphics;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        super(scene, game, controller);
    }

    public getView(): Phaser.GameObjects.GameObject {
        return this.ballIcon;
    }

    public create() {
        // Ugly. Needs to be a sprite...
        this.ballIcon = new Phaser.GameObjects.Graphics(this.scene);
        this.ballIcon.clear();
        this.ballIcon.fillStyle(0xffff00, 1);
        this.ballIcon.fillCircle(0, 0, 5);
    }

    public redraw() {
        let ballCoordinate = this.game.getBallCoordinate();

        if (ballCoordinate) {
            let [pX,pY] = this.controller.convertToPixels(ballCoordinate.add(0.8, 0.8));

            this.ballIcon.setPosition(pX, pY);
            this.ballIcon.visible = true;
        } else {
            this.ballIcon.visible = false;
        }
    }

    public resize(scale: number) {
    }
}
