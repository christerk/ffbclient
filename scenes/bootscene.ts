import Phaser from "phaser";
import * as Core from "../core";
import { AbstractScene } from "./abstractscene";

export class BootScene extends AbstractScene {

    private width: number;
    private height: number;
    private assets;
    private spritesheets;
    private phase;
    private loadingText;
    private texts: string[];

    public constructor(controller: Core.Controller) {
        super('bootScene', controller);
        console.log("Boot Scene: constructed");

        this.texts = [
            "Always Hungry",
            "Arguing Calls",
            "Biting Thralls",
            "Breaking Cages",
            "Bribing the Ref",
            "Fouling Witch Elves",
            "Greasing Shoes",
            "Loading Dice",
            "Nuffle, Nuffle, Nuffle",
            "Pogoing Sticks",
            "Preparing Avalance of Ones",
            "Processing Warpstone",
            "Refueling Deathroller",
            "Rerolling Injury Rolls",
            "Spiking Ball",
            "Stealing Playbooks",
            "Taking Root",
            "Topdecking Pit Trap",
            "Voting for Pie",
        ];
    }

    public init(config) {
        console.log('Boot Scene: init', config);

        console.log(this);

        this.phase = 1;
        this.assets = this.controller.getGameState().getAssets();
        this.spritesheets = {};

        this.width = this.sys.canvas.width;
        this.height = this.sys.canvas.height;
    }

    public preload() {
        console.log('Boot Scene: preload', this.assets);

        for (let sprite of this.assets['sprites']) {
            let key = "/"+sprite;
            let sheet = this.load.image(key, 'https://fumbbl.com/'+sprite);
            this.spritesheets[key] = '/'+sprite;
        }

        for (let image of this.assets['graphics']) {
            console.log("Loading image", image);
            this.load.image(image, 'https://fumbbl.com/'+image);
        }

        this.load.image("pitch", "https://fumbbl.com/i/561518");
        this.load.image("dugout", "https://fumbbl.com/i/563498");
        
        this.load.spritesheet("d6", "https://fumbbl.com/i/562665", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.spritesheet("db", "https://fumbbl.com/i/562707", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.spritesheet("d8", "https://fumbbl.com/i/562717", {
            frameWidth: 100,
            frameHeight: 100,
        })

        this.controller.SoundEngine.load(this);

        this.initialize();
    }

    public create(config) {
        console.log('Boot Scene: create', config);
    }

    public update() {
    }

    private initialize() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(this.width / 4, this.height / 2 - 25, this.width / 2, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        this.loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: this.texts[Math.floor(Math.random() * this.texts.length)] + "...",
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(this.width / 4 + 10, this.height / 2 - 15, (this.width / 2 - 20) * value, 30);
        });

        this.load.on('fileprogress', (file) => {
        });

        this.load.on('complete', () => {

            for (let key in this.spritesheets) {
                let sprite = this.add.sprite(0, 0, key);
                sprite.visible=false;
                this.generateSpriteFrames(sprite);

            }

            this.generateTextures();
            
            this.controller.setScene("mainScene");
        });
    }

    private generateSpriteFrames(sprite: Phaser.GameObjects.Sprite) {
        let width = sprite.width;
        let height = sprite.height;
        let tileSize = Math.floor(width / 4);
        let numRows = height / tileSize;

        for (let y=0; y<numRows; y++) {
            for (let x=0; x<4; x++) {
                let frameNumber: number = y * 4 + x;
                sprite.texture.add(frameNumber, 0, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
     }

    private generateTextures() {
        let moveSquare = this.make.graphics({});
        moveSquare.clear();
        moveSquare.fillStyle(0xffffff, 0.25);
        moveSquare.fillRect(0, 0, 100, 100);
        moveSquare.generateTexture("moveSquare", 100, 100);
    }
}
