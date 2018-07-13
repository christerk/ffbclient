import Phaser from "phaser";
import * as Core from "../core";

export class AbstractScene extends Phaser.Scene {
    protected controller: Core.Controller;

    public constructor(key: string, controller: Core.Controller) {
        super({
            key: key,
        });
        this.controller = controller;
    }
}
