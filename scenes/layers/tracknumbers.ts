import Phaser from "phaser";
import * as Core from "../../core";
import * as Model from "../../model";
import * as Layers from ".";
import * as Types from "../../types";

export class TrackNumbers extends Layers.Abstract {
    private container: Phaser.GameObjects.Container;
    private trackNumberIcons: Phaser.GameObjects.Graphics[];

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        super(scene, game, controller);
        this.container = scene.make.container({});
        this.trackNumberIcons = [];
    }

    public getView(): Phaser.GameObjects.GameObject {
        return this.container;
    }

    public create() {
    }

    public redraw() {
        this.trackNumberIcons.map((i) => i.visible = false);
        let i=0;
        let squares = this.game.getTrackNumbers();
        for (let index in squares) {
            let coordinate = squares[i]
            if (i == this.trackNumberIcons.length) {
                let icon = new Phaser.GameObjects.Graphics(this.scene);
                icon.clear();
                icon.fillStyle(0xff9F00, 1);
                icon.fillCircle(0, 0, 5);
                this.trackNumberIcons.push(icon);
            }
            let icon = this.trackNumberIcons[i];

            let [pX,pY] = this.controller.convertToPixels(coordinate.add(0.5, 0.5));

            icon.setPosition(pX, pY);
            icon.visible = true;
            i++;
        }

    }
}
