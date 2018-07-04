import Phaser from "phaser";
import { Dice } from "./scenes/animations/dice";

export class DiceManager {
    private scene: Phaser.Scene;
    private dice: Dice;
    private diceSerial: number;

    private d6cache: Phaser.GameObjects.Sprite[];

    public constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.d6cache = [];
        this.dice = new Dice();
        this.diceSerial = 0;
    }

    public roll2d6(target1: number, target2: number, x: number, y: number) {
        let d6_1 = this.getd6();
        let d6_2 = this.getd6();

        let anim1 = this.dice.getAnimation(this.scene, "dice:animation:" + d6_1.name, target1);
        let anim2 = this.dice.getAnimation(this.scene, "dice:animation:" + d6_2.name, target2);

        let vec = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 25);

        d6_1.setPosition(x + vec.x, y + vec.y);
        d6_2.setPosition(x - vec.x, y - vec.y);

        d6_1.visible = true;
        d6_2.visible = true;
        d6_1.anims.play(anim1);
        d6_2.anims.play(anim2);
    }

    private getd6(): Phaser.GameObjects.Sprite {
        let d6: Phaser.GameObjects.Sprite;

        if (this.d6cache.length > 0) {
            d6 = this.d6cache.pop();
        } else {
            this.diceSerial++;

            d6 = this.scene.add.sprite(100, 100, "d6");
            d6.setName("d6:" + this.diceSerial.toString());
            d6.setScale(0.5, 0.5);

            d6.addListener('animationcomplete', () => {
                this.scene.tweens.add({
                    targets: d6,
                    duration: 500,
                    alpha: 0,
                    onComplete: () => {
                        d6.visible = false;
                        d6.alpha = 1;
                        this.d6cache.push(d6);
                    }
                });
            });
        }

        d6.angle = Math.random() * 360;

        return d6;
    }
}
