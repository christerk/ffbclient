import Phaser from "phaser";

export class Dice {
    private width: number;
    private height: number;
    private dbRemap: number[];
    private targets: number[][][];

    public constructor() {

        this.width = 20;
        this.height = 19;

        this.targets = [
            [],
            [[5,0], [5,1], [5,2], [5,3], [5,4], [5,5], [5,6], [5,7], [5,8], [5,9], [5,10], [5,11], [5,12], [5,13], [5,14], [5,15], [5,16], [5,17], [5,18]],
            [[0,10], [10,0]],
            [[0,15], [10,5]],
            [[0,5], [10,15]],
            [[0,0], [10,10]],
            [[15,0], [15,1], [15,2], [15,3], [15,4], [15,5], [15,6], [15,7], [15,8], [15,9], [15,10], [15,11], [15,12], [15,13], [15,14], [15,15], [15,16], [15,17], [15,18]],
        ];

        // FFB             Sprite Sheet
        // 1 = Skull       1 = Pow
        // 2 = Both Down   2 = Pushback
        // 3 = Pushback    3 = Pow/Push
        // 4 = Pushback    4 = Both Down
        // 5 = Pow/Push    5 = Pushback
        // 6 = Pow         6 = Skull

        this.dbRemap = [0, 6, 4, 2, 5, 3, 1];
    }

    public remapBlockDice(target: number) {
        return this.dbRemap[target];
    }

    public getAnimation(spritesheet: string, scene: Phaser.Scene, key: string, target: number) {
        let config: AnimationConfig = {
            key: key,
            frames: this.generateRollFrames(spritesheet, target, 60),
            repeat: 0,
            frameRate: 60
        };

        if (scene.anims.get(key)) {
            scene.anims.remove(key);
        }

        scene.anims.create(config);

        return key;
    }

    private generateRollFrames(key: string, target: number, numFrames: number): AnimationFrameConfig[] {
        console.log("Generating Roll Frames for",key,target);
        let t = this.targets[target];
        let coords = t[Math.floor(Math.random()*t.length)];
        let offsetX = coords[0];
        let offsetY = coords[1];

        // Generate decelerating path from random point to [0,0]

        let result:AnimationFrameConfig[] = [];

        let startX = 0.25 + Math.random() * 0.75;
        let startY = 0.25 + Math.random() * 0.75;

        let ease = Phaser.Math.Easing.Quadratic.Out;

        let force = 3;

        let delta = 1.0 / numFrames;
        let currentFrame: number;
        for (let p = 0; p<=1; p += delta) {
            let v = ease(p);

            let cX = startX + (-startX * v);
            let cY = startY + (-startY * v);
            let spriteX = (Math.ceil(force)*this.width + Math.round(cX * this.width * force) + offsetX) % this.width;
            let spriteY = (Math.ceil(force)*this.height + Math.round(cY * this.height * force) + offsetY) % this.height;

            currentFrame = spriteX + spriteY*this.width;
            result.push({
                key: key,
                frame: currentFrame
            });
        }

        return result;
    }

}
