import Phaser from "phaser";
import * as Core from ".";

export class SoundEngine {
    private controller: Core.Controller;
    private scene: Phaser.Scene;
    private sounds: {[key: string]: string};

    public constructor() {
        this.sounds = {};

        this.addSound("block");
        this.addSound("blunder");
        this.addSound("bounce");
        this.addSound("catch");
        this.addSound("chainsaw");
        this.addSound("click");
        this.addSound("ding");
        this.addSound("dodge");
        this.addSound("duh");
        this.addSound("ew");
        this.addSound("explode");
        this.addSound("fall");
        this.addSound("fireball");
        this.addSound("foul");
        this.addSound("hypno");
        this.addSound("injury");
        this.addSound("kick");
        this.addSound("ko");
        this.addSound("lightning");
        this.addSound("metal");
        this.addSound("nomnom");
        this.addSound("organ");
        this.addSound("pickup");
        this.addSound("question");
        this.addSound("rip");
        this.addSound("roar");
        this.addSound("root");
        this.addSound("slurp");
        this.addSound("stab");
        this.addSound("step");
        this.addSound("touchdown");
        this.addSound("throw");
        this.addSound("whistle");
        this.addSound("woooaaah");
        this.addSound("specAah");
        this.addSound("specBoo");
        this.addSound("specCheer");
        this.addSound("specClap");
        this.addSound("specCrickets");
        this.addSound("specLaugh");
        this.addSound("specOoh");
        this.addSound("specShock");
        this.addSound("specStomp");
        this.addSound("silence");
    }

    public setController(controller: Core.Controller) {
        this.controller = controller;
    }

    public addSound(key: string) {
        this.sounds[key] = "/sounds/" + key;
    }

    public play(sound: string) {
        console.log("Playing Sound", sound);
        this.scene.sound.play(sound);
    }

    public load(scene: Phaser.Scene) {
        this.scene = scene;
        for (let s in this.sounds) {
            scene.load.audio(s, [
                "https://fumbbl.com" + this.sounds[s] + ".ogg",
                "https://fumbbl.com" + this.sounds[s] + ".mp3"
            ]);
        }
    }

    public start() {
        this.scene.sound.pauseOnBlur = false;
    }
}
