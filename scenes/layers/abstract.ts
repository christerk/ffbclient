import * as Core from "../../core";
import * as Model from "../../model";

export abstract class Abstract {
    protected scene: Phaser.Scene;
    protected controller: Core.Controller;
    protected game: Model.Game;
    protected scale: number;
    protected gridSize: number;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        this.controller = controller;
        this.scene = scene;
        this.game = game;
    }

    public resize(scale: number, gridSize: number): void {
        this.scale = scale;
        this.gridSize = gridSize;
    }

    public abstract create(): void;
    public abstract redraw(): void;
    public abstract getView(): Phaser.GameObjects.GameObject;

}