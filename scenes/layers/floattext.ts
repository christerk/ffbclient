import Phaser from "phaser";
import * as Core from "../../core";
import * as Model from "../../model";
import * as Layers from ".";
import * as Types from "../../types";

export class FloatText extends Layers.Abstract {
    private floatTextQueue: Promise<any>;

    private container: Phaser.GameObjects.Container;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        super(scene, game, controller);
        this.container = scene.make.container({});
        this.floatTextQueue = Promise.resolve();
    }

    public getView(): Phaser.GameObjects.GameObject {
        return this.container;
    }

    public create() {
    }

    public redraw() {
    }

    public resize(scale: number, gridSize) {
        super.resize(scale, gridSize);
    }

    public floatText(player: Model.Player, text: string) {
        this.floatTextQueue = this.floatTextQueue
        .then(() => {
            return new Promise<any>((resolve, reject) => {
                setTimeout(() => { resolve(); }, 333);
                this.executeFloatText(player, text);
            });
        });
    }

    public kickoff(kickoff: string) {
        this.floatTextQueue = this.floatTextQueue
        .then(() => {
            return new Promise<any>((resolve, reject) => {
                setTimeout(() => { resolve(); }, 333);
                this.executeKickoff(kickoff);
            });            
        });
    }

    private executeKickoff(kickoff: string) {
        let [x, y] = this.controller.convertToPixels(new Types.Coordinate(13, 7.5));

        let t = this.scene.add.text(x, y, kickoff.toUpperCase(), {
            fontSize: (this.gridSize * 2.5) + 'px',
            fill: 'white',
            stroke: 'black',
            strokeThickness: 2,
        });
        t.setFontFamily("arial");
        t.setOrigin(0.5);
        t.setScale(0);

        let timeline = this.scene.tweens.createTimeline({});

        timeline.add({
            targets: t,
            duration: 1000,
            ease: 'Quad.easeIn',
            scaleX: 1,
            scaleY: 1,
        });

        timeline.add({
            targets: t,
            duration: 1000,
            alpha: 0,
            ease: 'Expo.easeIn',
            onComplete: () => {
                t.visible = false;
                t.destroy();
            }
        });
        timeline.play();

    }

    private executeFloatText(player: Model.Player, text: string) {
        if (player == null || !text) {
            return;
        }

        let pos = player.getLocation();
        let [x, y] = this.controller.convertToPixels(pos);
        let t = this.scene.add.text(x, y, text.toUpperCase(), {
            fontSize: (this.gridSize / 3) + 'px',
            fill: 'white',
            stroke: 'black',
            strokeThickness: 2,

        });
        t.x = t.x - t.width / 2 + this.gridSize / 2;
        this.scene.tweens.add({
            targets: t,
            duration: 1000,
            ease: 'Quad.easeIn',
            alpha: 0,
            y: y - this.gridSize * 2,
            onComplete: () => {
                t.visible = false;
                t.destroy();
            }
        });
    }
}
