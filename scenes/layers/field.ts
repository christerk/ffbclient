import Phaser from "phaser";
import * as Core from "../../core";
import * as Model from "../../model";
import * as Layers from ".";
import * as Types from "../../types";

export class Field extends Layers.Abstract {
    private container: Phaser.GameObjects.Container;
    private pitch: Phaser.GameObjects.Image;
    private homeTeamName: Phaser.GameObjects.Text;
    private awayTeamName: Phaser.GameObjects.Text;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        super(scene, game, controller);
    }

    public getView(): Phaser.GameObjects.GameObject {
        return this.container;
    }

    public create() {
        this.container = this.scene.make.container({});

        this.pitch = new Phaser.GameObjects.Image(this.scene, 0, 0, "pitch");
        this.pitch.setOrigin(0, 0);

        this.pitch.setInteractive();

        this.homeTeamName = this.createTeamName(this.game.teamHome.getName());
        this.awayTeamName = this.createTeamName(this.game.teamAway.getName());
        this.homeTeamName.setAngle(270);
        this.awayTeamName.setAngle(90);

        this.container.add(this.pitch);
        this.container.add(this.homeTeamName);
        this.container.add(this.awayTeamName);
    }

    public redraw() {

    }

    public resize(scale: number, gridSize: number) {
        super.resize(scale, gridSize);
        
        this.pitch.setScale(scale);

        this.homeTeamName.setFontSize(gridSize * 0.9);
        this.awayTeamName.setFontSize(gridSize * 0.9);

        let [x,y] = this.controller.convertToPixels(new Types.Coordinate(0.5, 7.5));
        this.homeTeamName.setPosition(x, y);

        [x,y] = this.controller.convertToPixels(new Types.Coordinate(25.5, 7.5));
        this.awayTeamName.setPosition(x + 2, y);
    }

    public getPitchWidth() {
        return this.pitch.width;
    }

    public getPitchHeight() {
        return this.pitch.height;
    }

    public getDisplayWidth() {
        return this.pitch.displayWidth;
    }

    public getDisplayHeight() {
        return this.pitch.displayHeight;
    }

    private createTeamName(name: string): Phaser.GameObjects.Text {
        let t = new Phaser.GameObjects.Text(this.scene, 0, 0, name.toUpperCase(), {});
        t.setFontFamily("arial");
        t.setColor("#ffffff");
        t.setAlpha(0.5);
        t.setOrigin(0.5, 0.5);
        t.setBlendMode(Phaser.BlendModes.OVERLAY);

        return t;
    }
}
