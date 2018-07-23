import Phaser from "phaser";
import * as Core from "../../core";
import * as Model from "../../model";
import * as Layers from ".";
import * as Types from "../../types";

export class Dugout extends Layers.Abstract {
    private container: Phaser.GameObjects.Container;
    private background: Phaser.GameObjects.Image;
    private homeTeamName: Phaser.GameObjects.Text;
    private awayTeamName: Phaser.GameObjects.Text;
    private side: Model.Side;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller, side: Model.Side) {
        super(scene, game, controller);

        this.side = side;
    }

    public getView(): Phaser.GameObjects.GameObject {
        return this.container;
    }

    public create() {
        this.container = this.scene.make.container({});

        this.background = new Phaser.GameObjects.Image(this.scene, 0, 0, "dugout");

        this.background.setInteractive();

        if (this.side == Model.Side.Home) {
            this.background.setPosition(0,0);
            this.background.setOrigin(0, 1);
        } else {
            this.background.setPosition(391,0);
            this.background.setFlipX(true);
            this.background.setOrigin(1, 1);
        }

        this.container.add(this.background);
    }

    public redraw() {

    }

    public resize(scale: number, gridSize: number) {
        super.resize(scale, gridSize);
        
        this.background.setScale(scale);
        if (this.side == Model.Side.Away) {
            this.background.setPosition(gridSize * 13 + 2, 0);
        }
    }
}
