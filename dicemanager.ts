import Phaser from "phaser";
import { Dice } from "./scenes/animations/dice";
import { Coordinate } from "./types";
import Controller from "./controller";

export type DieType = "d6" | "db" | "d8" | "d68";

type RollType = {
    background: Phaser.GameObjects.Graphics,
    dice: {
        type: DieType,
        sprite: Phaser.GameObjects.Sprite,
    }[];
    location: string;
}

export class DiceManager {
    private controller: Controller;
    private scene: Phaser.Scene;
    private scale: number;
    private dice: Dice;
    private diceSerial: number;
    private diceConfig: {[type: string] : {
        spreadScale: number,
        size: number
    }};
    private rollCounter: number;
    private activeRolls: { [key: string]: RollType };

    private dieCache: { [type: string]: Phaser.GameObjects.Sprite[] };

    private rollQueue: Promise<any>;

    public constructor(controller: Controller) {
        this.controller = controller;
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
        this.activeRolls = {};
        this.rollCounter = 0;

        this.rollQueue = <Promise<any>> Promise.resolve();
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

    public roll(type: DieType, targets: number[], coordinate: Coordinate, duration = 1000, delay = 0): string {
        let rollKey = "Roll:" + (++this.rollCounter);

        this.rollQueue = this.rollQueue
        .then(() => {
            return new Promise<any>((resolve, reject) => {
                setTimeout(() => { resolve(); }, 333);
                this.executeRoll(rollKey, type, targets, coordinate, duration, delay);
            });
        });

        return rollKey;
    }

    public executeRoll(rollKey: string, type: DieType, targets: number[], coordinate: Coordinate, duration = 1000, delay = 0) {
        let emptySpace = this.controller.findEmptyPatchNearLocation(coordinate, 2, 2);

        let locationKey = this.controller.allocateBoardSpace(emptySpace, 2, 2);

        let [x, y] = this.controller.convertToPixels(emptySpace.add(1,1));

        let dice: { type: DieType, sprite: Phaser.GameObjects.Sprite}[] = [];
        let numDice = targets.length;
        let localSpread = this.getLocalSpread(numDice);

        let spreadScale = this.diceConfig[type].spreadScale;
        let size = this.diceConfig[type].size;
        let angle = Math.random() * 2 * Math.PI;
        let angleStep = Math.PI / 8;

        let bg = this.scene.add.graphics();
        bg.clear();
        bg.fillStyle(0x0, 0.3);
        let [w,h] = this.controller.convertToPixels(new Coordinate(2,2));
        bg.fillRect(-w/2,-h/2,w,h);
        bg.setPosition(x, y);

        if (type == "d68") {
            // Special case for d68 rolls
            if (numDice == 2) {
                let sprite = this.getDie("d6");
                dice.push({ type: "d6", sprite: sprite });
                let pX = x + localSpread[0][0] * spreadScale * this.scale;
                let pY = y + localSpread[0][1] * spreadScale * this.scale;
                this.generateRoll("d6", sprite, size, targets[0], pX, pY, duration, angle, delay, locationKey);
                sprite = this.getDie("d8");
                dice.push({ type: "d8", sprite: sprite });
                pX = x + localSpread[1][0] * spreadScale * this.scale;
                pY = y + localSpread[1][1] * spreadScale * this.scale;
                this.generateRoll("d8", sprite, size, targets[1], pX, pY, duration, angle + angleStep, delay, locationKey);
            } else {
                console.log("Strange d68 roll encountered", targets);
            }
        } else {
            for (let i = 0; i<numDice; i++) {
                let sprite = this.getDie(type);
                dice.push({ type: type, sprite: sprite });
                let pX = x + localSpread[i][0] * spreadScale * this.scale;
                let pY = y + localSpread[i][1] * spreadScale * this.scale;
                this.generateRoll(type, sprite, size, targets[i], pX, pY, duration, angle + i*angleStep, delay, locationKey);
            }
        }

        let rollData: RollType = {
            dice: dice,
            background: bg,
            location: locationKey,
        }

        this.activeRolls[rollKey] = rollData;

        console.log("Adding roll", rollKey, locationKey);

        if (type != "db" && dice.length > 0) {
            dice[0].sprite.addListener('animationcomplete', () => {
                this.fadeRoll(rollKey, 500);
            });
        }
    }

    public displayBlockChoice(rollKey: string, choice: number) {
        let roll = this.activeRolls[rollKey];
        if (roll) {
            for (let i = 0; i<roll.dice.length; i++) {
                let d = roll.dice[i].sprite;
                if (i != choice) {
                    d.setAlpha(0.35);
                }
            }
            this.fadeRoll(rollKey, 1000);
        }
    }

    private generateRoll(type: DieType, sprite: Phaser.GameObjects.Sprite, scale: number, target: number, x: number, y: number, duration: number, angle: number, delay = 0, locationKey: string)  {
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
        }

        die.angle = Math.random() * 360;
        die.visible = false;

        return die;
    }

    public fadeRoll(rollKey: string, delay: number = 0) {
        this.rollQueue = this.rollQueue
        .then(() => {
            this.executeFadeRoll(rollKey, delay);
            return Promise.resolve();
        });
    }

    public executeFadeRoll(rollKey: string, delay: number = 0) {
        console.log("Removing roll", rollKey);
        let roll: RollType = this.activeRolls[rollKey];
        if (roll != undefined) {
            this.scene.tweens.add({
                targets: roll.dice.map( (d) => d.sprite),
                delay: delay,
                duration: 500,
                alpha: 0,
                onComplete: () => {
                    roll.dice.map((die) => {
                        die.sprite.visible = false;
                        die.sprite.alpha = 1;
                        die.sprite.removeAllListeners();
                        this.dieCache[die.type].push(die.sprite);
                    });
                    this.controller.freeBoardSpace(roll.location);
                    delete this.activeRolls[rollKey];
                }
            });
            roll.background.destroy();
        }
    }

}
