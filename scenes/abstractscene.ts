import Phaser from "phaser";
import Controller from "../controller";

export class AbstractScene extends Phaser.Scene {
    protected controller: Controller;

    public constructor(key: string, controller: Controller) {
        super({
            key: key,
        });
        this.controller = controller;
    }
}
