import Phaser from "phaser";
import { Dice } from "./scenes/animations/dice";

type DieType = "d6" | "db";

export class DiceManager {
    private scene: Phaser.Scene;
    private scale: number;
    private dice: Dice;
    private diceSerial: number;

    private dieCache: { [type: string]: Phaser.GameObjects.Sprite[] };

    public constructor() {
        this.dieCache = {
            "d6": [],
            "db": [],
        };
        this.dice = new Dice();
        this.diceSerial = 0;
        this.scale = 1;
    }

    public setScene(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public setScale(scale: number) {
        this.scale = scale;
    }

    public rolld6(target: number, x: number, y: number, duration = 1000) {
        let sprite = this.getDie("d6");
        let angle = Math.random() * Math.PI * 2;
        this.generateRoll("d6", sprite, 0.25, target, x, y, duration, angle);
    }

    public roll2d6(target1: number, target2: number, x: number, y: number, duration = 1000) {
        let sprite_1 = this.getDie("d6");
        let sprite_2 = this.getDie("d6");

        let vec = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 15 * this.scale);

        let angle1 = Math.random() * Math.PI * 2;
        let angle2 = angle1 + Math.PI / 4;

        this.generateRoll("d6", sprite_1, 0.25, target1, x + vec.x, y + vec.y, duration, angle1);
        this.generateRoll("d6", sprite_2, 0.25, target2, x - vec.x, y - vec.y, duration, angle2);
    }

    public rolldb(target: number, x: number, y: number, duration = 1000) {
        let sprite = this.getDie("db");
        let angle = Math.random() * Math.PI * 2;
        this.generateRoll("db", sprite, 0.33, target, x, y, duration, angle);
    }

    public roll2db(target1: number, target2: number, x: number, y: number, duration = 1000) {
        let sprite_1 = this.getDie("db");
        let sprite_2 = this.getDie("db");

        let vec = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 20 * this.scale);

        let angle1 = Math.random() * Math.PI * 2;
        let angle2 = angle1 + Math.PI / 4;

        this.generateRoll("db", sprite_1, 0.33, target1, x + vec.x, y + vec.y, duration, angle1);
        this.generateRoll("db", sprite_2, 0.33, target2, x - vec.x, y - vec.y, duration, angle2);
    }

    public roll3db(target1: number, target2: number, target3: number, x: number, y: number, duration = 1000) {
        let sprite_1 = this.getDie("db");
        let sprite_2 = this.getDie("db");
        let sprite_3 = this.getDie("db");

        let a = Math.random() * Math.PI * 2;

        let v1 = new Phaser.Math.Vector2().setToPolar(a, 20 * this.scale);
        let v2 = new Phaser.Math.Vector2().setToPolar(a - Math.PI * 2/3, 20 * this.scale);
        let v3 = new Phaser.Math.Vector2().setToPolar(a + Math.PI * 2/3, 20 * this.scale);

        let angle1 = Math.random() * Math.PI * 2;
        let angle2 = angle1 + Math.PI / 4;
        let angle3 = angle1 - Math.PI / 4;

        this.generateRoll("db", sprite_1, 0.33, target1, x + v1.x, y + v1.y, duration, angle1);
        this.generateRoll("db", sprite_2, 0.33, target2, x + v2.x, y + v2.y, duration, angle2);
        this.generateRoll("db", sprite_2, 0.33, target3, x + v3.x, y + v3.y, duration, angle3);
    }

    private generateRoll(type: DieType, sprite: Phaser.GameObjects.Sprite, scale: number, target: number, x: number, y: number, duration = 1000, angle: number)  {

        if (type == "db") {
            target = this.dice.remapBlockDice(target);
        }

        let anim = this.dice.getAnimation(type, this.scene, "dice_animation:" + sprite.name, target);
        let start = new Phaser.Math.Vector2();
        start.setToPolar(angle, 300 * this.scale)
        sprite.setPosition(x + start.x, y + start.y);
        sprite.setScale(scale * this.scale, scale * this.scale);

        let timeline = this.scene.tweens.createTimeline({});

        timeline.add({
            targets: sprite,
            ease: 'Circ.easeOut',
            duration: duration * 3 / 4,
            scaleX: 4 * scale * this.scale,
            scaleY: 4 * scale * this.scale,
        });

        timeline.add({
            targets: sprite,
            ease: 'Bounce.easeOut',
            duration: duration * 1 / 4,
            scaleX: scale * this.scale,
            scaleY: scale * this.scale,
        });

        timeline.play();

        this.scene.tweens.add({
            targets: sprite,
            duration: duration,
            ease: 'Quad.easeOut',
            x: x,
            y: y,
        });

        sprite.visible = true;
        sprite.anims.play(anim);
    }

    private getDie(type: DieType): Phaser.GameObjects.Sprite {
        let die: Phaser.GameObjects.Sprite;

        if (this.dieCache[type].length > 0) {
            die = this.dieCache[type].pop();
        } else {
            this.diceSerial++;

            die = this.scene.add.sprite(100, 100, "d6");
            die.setName("d6:" + this.diceSerial.toString());

            die.addListener('animationcomplete', () => {
                this.scene.tweens.add({
                    targets: die,
                    delay: 500,
                    duration: 500,
                    alpha: 0,
                    onComplete: () => {
                        die.visible = false;
                        die.alpha = 1;
                        this.dieCache[type].push(die);
                    }
                });
            });
        }

        die.angle = Math.random() * 360;

        return die;
    }


}
