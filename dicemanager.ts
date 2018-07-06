import Phaser from "phaser";
import { Dice } from "./scenes/animations/dice";

export type DieType = "d6" | "db" | "d8" | "d68";

export class DiceManager {
    private scene: Phaser.Scene;
    private scale: number;
    private dice: Dice;
    private diceSerial: number;
    private diceConfig: {[type: string] : {
        spreadScale: number,
        size: number
    }};

    private dieCache: { [type: string]: Phaser.GameObjects.Sprite[] };

    public constructor() {
        this.dieCache = {
            "d6": [],
            "db": [],
            "d8": [],
        };
        this.dice = new Dice();
        this.diceSerial = 0;
        this.scale = 1;

        this.diceConfig = {
            "d6": {
                spreadScale: 15,
                size: 0.25,
            },
            "db": {
                spreadScale: 20,
                size: 0.33,
            },
            "d8": {
                spreadScale: 15,
                size: 0.25,
            },
            "d68": {
                spreadScale: 15,
                size: 0.25,
            }
        }
    }

    public setScene(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public setScale(scale: number) {
        this.scale = scale;
    }

    private getLocalSpread(numDice: number): number[][] {
        if (numDice == 1) {
            return [[0,0]];
        } else {
            let result:number[][] = [];
            let angleStep = 2 * Math.PI / numDice;
            let currentAngle = Math.random() * 2 * Math.PI;
            let vec = new Phaser.Math.Vector2();
            for (let i=0; i<numDice; i++) {
                vec = vec.setToPolar(currentAngle);
                currentAngle += angleStep;
                result.push([vec.x, vec.y]);
            }
            return result;
        }
    }

    public roll(type: DieType, targets: number[], x: number, y: number, duration = 1000, delay = 0): Phaser.GameObjects.Sprite[] {
        let sprites: Phaser.GameObjects.Sprite[] = [];
        let numDice = targets.length;
        let localSpread = this.getLocalSpread(numDice);

        let spreadScale = this.diceConfig[type].spreadScale;
        let size = this.diceConfig[type].size;
        let angle = Math.random() * 2 * Math.PI;
        let angleStep = Math.PI / 8;

        if (type == "d68") {
            // Special case for d68 rolls
            if (numDice == 2) {
                let sprite = this.getDie("d6");
                sprites.push(sprite);
                let pX = x + localSpread[0][0] * spreadScale * this.scale;
                let pY = y + localSpread[0][1] * spreadScale * this.scale;
                this.generateRoll("d6", sprite, size, targets[0], pX, pY, duration, angle, delay);
                sprite = this.getDie("d8");
                sprites.push(sprite);
                pX = x + localSpread[1][0] * spreadScale * this.scale;
                pY = y + localSpread[1][1] * spreadScale * this.scale;
                this.generateRoll("d8", sprite, size, targets[1], pX, pY, duration, angle + angleStep, delay);
            } else {
                console.log("Strange d68 roll encountered", targets);
            }
        } else {
            for (let i = 0; i<numDice; i++) {
                let sprite = this.getDie(type);
                sprites.push(sprite);
                let pX = x + localSpread[i][0] * spreadScale * this.scale;
                let pY = y + localSpread[i][1] * spreadScale * this.scale;
                this.generateRoll(type, sprite, size, targets[i], pX, pY, duration, angle + i*angleStep, delay);
            }
        }

        return sprites;
    }

    private generateRoll(type: DieType, sprite: Phaser.GameObjects.Sprite, scale: number, target: number, x: number, y: number, duration: number, angle: number, delay = 0)  {
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
            delay: delay,
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
            delay: delay,
            ease: 'Quad.easeOut',
            x: x,
            y: y,
        });

        // Delay the spin animation until it's time to animate..
        if (delay == 0) {
            sprite.visible = true;
            sprite.anims.play(anim);
        } else {
            setTimeout(() => {
                sprite.visible = true;
                sprite.anims.play(anim);
            }, delay);
        }
    }

    private getDie(type: DieType): Phaser.GameObjects.Sprite {
        let die: Phaser.GameObjects.Sprite;

        if (this.dieCache[type].length > 0) {
            die = this.dieCache[type].pop();
        } else {
            this.diceSerial++;

            die = this.scene.add.sprite(100, 100, "d6");
            die.setName("d6:" + this.diceSerial.toString());

            if (type != "db") {
                die.addListener('animationcomplete', () => {
                    this.fadeDie(type, die, 500);
                });
            }
        }

        die.angle = Math.random() * 360;
        die.visible = false;

        return die;
    }

    public fadeDie(type: string, die: Phaser.GameObjects.Sprite, delay: number) {
        this.scene.tweens.add({
            targets: die,
            delay: delay,
            duration: 500,
            alpha: 0,
            onComplete: () => {
                die.visible = false;
                die.alpha = 1;
                this.dieCache[type].push(die);
            }
        });
    }
}
