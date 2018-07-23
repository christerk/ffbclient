import Phaser from "phaser";
import * as Core from "../../core";
import * as Model from "../../model";
import * as Layers from ".";
import * as Types from "../../types";

export class MoveSquares extends Layers.Abstract {
    private container: Phaser.GameObjects.Container;
    private moveSquareIcons: Phaser.GameObjects.Sprite[];

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        super(scene, game, controller);
        this.container = scene.make.container({});
        this.moveSquareIcons = [];
    }

    public getView(): Phaser.GameObjects.GameObject {
        return this.container;
    }

    public create() {
    }

    public redraw() {
        this.moveSquareIcons.map((i) => i.visible = false);

        let i=0;
        let squares = this.game.getMoveSquares();
        for (let index in squares) {
            let coordinate = squares[i]
            let [x, y] = this.controller.convertToPixels(coordinate.add(0.5, 0.5));
            if (i == this.moveSquareIcons.length) {
                let [w, h] = this.controller.convertToPixels(new Types.Coordinate(0.8, 0.8));
                let icon = new Phaser.GameObjects.Sprite(this.scene, x, y, "moveSquare");
                icon.setOrigin(0.5, 0.5);
                icon.setDisplaySize(w, h);
                this.moveSquareIcons.push(icon);
                this.container.add(icon);
            }
            let icon = this.moveSquareIcons[i];
            icon.setPosition(x, y);
            icon.visible = true;
            i++;
        }
    }

    public resize(scale: number, gridSize: number) {
        super.resize(scale, gridSize);
        
        let [w, h] = this.controller.convertToPixels(new Types.Coordinate(0.8, 0.8));
        this.moveSquareIcons.map(s => s.setDisplaySize(w,h));
    }
}
