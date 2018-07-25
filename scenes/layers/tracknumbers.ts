import Phaser from "phaser";
import * as Core from "../../core";
import * as Model from "../../model";
import * as Layers from ".";
import * as Types from "../../types";

export class TrackNumbers extends Layers.Abstract {
    private container: Phaser.GameObjects.Container;
    private trackNumberIcons: Phaser.GameObjects.Sprite[];

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

    public resize(scale: number, gridSize: number) {
        super.resize(scale, gridSize);
    }

    public redraw() {
        this.trackNumberIcons.map((i) => i.visible = false);
        let i=0;
        let squares = this.game.getTrackNumbers();
        let [w, h] = this.controller.convertToPixels(new Types.Coordinate(0.3, 0.3));
        for (let index in squares) {
            let coordinate = squares[i]
            if (i == this.trackNumberIcons.length) {
                let icon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "trackNumber");
                this.trackNumberIcons.push(icon);
                this.container.add(icon);
            }
            let icon = this.trackNumberIcons[i];

            let [pX,pY] = this.controller.convertToPixels(coordinate.add(0.5, 0.5));

            icon.setPosition(pX, pY);
            icon.setDisplaySize(w, h);
            icon.visible = true;
            i++;
        }

    }
}
