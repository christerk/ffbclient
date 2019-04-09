import Phaser from "phaser";
import * as Core from "../../core";
import * as Comp from "../components";
import * as Types from "../../types";
import * as Model from "../../model";
import * as Layers from ".";

export enum CameraView {
    Field,
    Dugouts
}

export class World {
    private scene: Phaser.Scene;
    private controller: Core.Controller;
    private game: Model.Game;
    private fieldLayer: Layers.Field;
    private moveSquareLayer: Layers.MoveSquares;
    private trackNumberLayer: Layers.TrackNumbers;
    private homeDugoutLayer: Layers.Dugout;
    private awayDugoutLayer: Layers.Dugout;
    private playerLayer: Layers.Player;
    private ballLayer: Layers.Ball;
    private floatTextLayer: Layers.FloatText;
    private container: Phaser.GameObjects.Container;
    private layers: Layers.Abstract[];
    private showingDugouts: boolean = false;

    private zoomFactor: number;
    private gridSize: number;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        this.controller = controller;
        this.scene = scene;
        this.game = game;

        this.container = scene.make.container({});

        this.fieldLayer = new Layers.Field(scene, game, controller);
        this.moveSquareLayer = new Layers.MoveSquares(scene, game, controller);
        this.trackNumberLayer = new Layers.TrackNumbers(scene, game, controller);
        this.homeDugoutLayer = new Layers.Dugout(scene, game, controller, Model.Side.Home);
        this.awayDugoutLayer = new Layers.Dugout(scene, game, controller, Model.Side.Away);
        this.playerLayer = new Layers.Player(scene, game, controller);
        this.ballLayer = new Layers.Ball(scene, game, controller);
        this.floatTextLayer = new Layers.FloatText(scene, game, controller);

        this.layers = [
            this.fieldLayer,
            this.moveSquareLayer,
            this.trackNumberLayer,
            this.homeDugoutLayer,
            this.awayDugoutLayer,
            this.playerLayer,
            this.ballLayer,
            this.floatTextLayer,
        ];

    }

    public create() {
        this.layers.map(l => l.create());

        this.container.add(this.layers.map(l => l.getView()));
        console.log("Created", this.playerLayer);
    }

    public resize(width: number, height: number) {
        let pitchWidth = this.fieldLayer.getPitchWidth();
        let pitchHeight = this.fieldLayer.getPitchHeight();

        let zoomFactorX = width / pitchWidth;
        let zoomFactorY = height / pitchHeight;
        let zoomFactor = Math.min(zoomFactorX, zoomFactorY);

        this.zoomFactor = zoomFactor;
        this.gridSize = zoomFactor * (pitchWidth-2)/26;

        this.controller.triggerEvent(Types.EventType.Resized, {
            w: this.scene.sys.canvas.clientWidth,
            h: this.scene.sys.canvas.clientHeight,
            scale: this.gridSize
        });

        this.layers.map(l => l.resize(zoomFactor, this.gridSize));
    }

    public toggleDugouts(camera: Phaser.Cameras.Scene2D.Camera){
        if (this.showingDugouts) {
            this.setCamera(camera, Layers.CameraView.Field)
        } else {
            this.setCamera(camera, Layers.CameraView.Dugouts)
        }
        this.showingDugouts = !this.showingDugouts;
    }

    public setCamera(camera: Phaser.Cameras.Scene2D.Camera, view: CameraView, animate: boolean = true) {
        let x: number;
        let y: number;

        switch(view) {
            case CameraView.Field:
                x = this.fieldLayer.getDisplayWidth() / 2;
                y = this.fieldLayer.getDisplayHeight() / 2;
                break;
            case CameraView.Dugouts:
                x = this.fieldLayer.getDisplayWidth() / 2;
                y = this.fieldLayer.getDisplayHeight() / 2 - this.gridSize * 6;
                break;
        }
        if (animate) {
            camera.pan(x, y, 300, Phaser.Math.Easing.Expo.Out);
        } else {
            camera.centerOn(x, y);
        }
    }

    public redraw() {
        this.layers.map(l => l.redraw());
    }

    public floatText(player: Model.Player, text: string) {
        this.floatTextLayer.floatText(player, text);
    }

    public kickoff(kickoff: string) {
        this.floatTextLayer.kickoff(kickoff);
    }

    public getZoomFactor() {
        return this.zoomFactor;
    }

    public getGridSize() {
        return this.gridSize;
    }

    public getDisplayWidth() {
        return this.fieldLayer.getDisplayWidth();
    }

    public getDisplayHeight() {
        return this.fieldLayer.getDisplayHeight();
    }

    public getView() {
        return this.container;
    }
}
