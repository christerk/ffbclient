import Phaser from "phaser";

export class Dice {
    private spritesheet: string;
    private width: number;
    private height: number;
    private targets: number[][][];

    public constructor() {

        this.spritesheet = 'd6';
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
    }

    public getAnimation(scene: Phaser.Scene, key: string, target: number) {
        let config: AnimationConfig = {
            key: key,
            frames: this.generateRollFrames(this.spritesheet, target, 60),
            repeat: 0,
            frameRate: 60
        };

        if (scene.anims.get(key)) {
            scene.anims.remove(key);
        }

        scene.anims.create(config);

        //scene.anims.add(key, anim);

        return key;
    }

    private generateRollFrames(key: string, target: number, numFrames: number): AnimationFrameConfig[] {
        let t = this.targets[target];
        let coords = t[Math.floor(Math.random()*t.length)];
        let offsetX = coords[0];
        let offsetY = coords[1];

        // Generate decelerating path from random point to [0,0]

        let result:AnimationFrameConfig[] = [];

        let start = Phaser.Math.RandomXY(new Phaser.Math.Vector2());

        let ease = Phaser.Math.Easing.Quadratic.Out;

        let force = 3;

        let delta = 1.0 / numFrames;
        for (let p = 0; p<=1; p += delta) {
            let v = ease(p);

            let cX = start.x + (-start.x * v);
            let cY = start.y + (-start.y * v);
            let spriteX = (Math.ceil(force)*this.width + Math.round(cX * this.width * force) + offsetX) % this.width;
            let spriteY = (Math.ceil(force)*this.height + Math.round(cY * this.height * force) + offsetY) % this.height;

            result.push({
                key: key,
                frame: spriteX + spriteY*this.width
            });
        }

        return result;
    }

}
