import Phaser from "phaser";
import * as Core from "../core";
import { AbstractScene } from "./abstractscene";

export class BootScene extends AbstractScene {

    private width: number;
    private height: number;
    private assets;
    private spritesheets;
    private phase;
    private homeLogo: Phaser.GameObjects.Image;
    private awayLogo: Phaser.GameObjects.Image;
    private loadingText: Phaser.GameObjects.Text;
    private progressBox: Phaser.GameObjects.Image;
    private progressBar: Phaser.GameObjects.Image;
    private vsText: Phaser.GameObjects.Text;
    private bg: Phaser.GameObjects.Image;
    private texts: string[];

    public constructor(controller: Core.Controller) {
        super("bootScene", controller);
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
            "Preparing Avalanche of Ones",
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

        this.bg = this.addBg();

        let progressBox = this.make.graphics({});
        let progressBar = this.make.graphics({});

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(0, 0, 100, 100);
        progressBox.generateTexture("progressBox", 100, 100);
        this.progressBox = new Phaser.GameObjects.Image(this, 0, 0, "progressBox");
        this.progressBox.setOrigin(0);
        this.progressBox.visible = false;
        this.add.existing(this.progressBox);

        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(0, 0, 100, 100);
        progressBar.generateTexture("progressBar", 100, 100);
        this.progressBar = new Phaser.GameObjects.Image(this, 0, 0, "progressBar");
        this.progressBar.setOrigin(0);
        this.progressBar.visible = false;
        this.add.existing(this.progressBar);

        this.homeLogo = new Phaser.GameObjects.Image(this, 0, 0, "");
        this.awayLogo = new Phaser.GameObjects.Image(this, 0, 0, "");

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        this.loadingText = this.make.text({
            x: 0,
            y: 0,
            text: this.texts[Math.floor(Math.random() * this.texts.length)] + "...",
            style: {
                fill: '#ffffff',
            }
        });
        this.loadingText.setFontFamily("arial");
        this.loadingText.setOrigin(0.5, 1);
        this.loadingText.setFontSize(24);

        this.load.on('progress', (value) => {
            let margin = this.progressBox.height * 0.1;
            this.progressBar.setPosition(this.progressBox.x + margin, this.progressBox.y + margin);
            this.progressBar.setDisplaySize((this.progressBox.displayWidth - 2 * margin) * value, this.progressBox.displayHeight - 2 * margin)
        });

        let homeLoaded = false;
        let awayLoaded = false;
        let bgLoaded = false;
        let fadeInTriggered = false;
        this.vsText = this.make.text({
            x: 0,
            y: 0,
            text: "VS",
            style: {
                fill: '#ffffff',
            }
        });

        this.vsText.setFontFamily("arial");
        this.vsText.setOrigin(0.5, 0.5);
        this.vsText.setFontSize(24);
        this.vsText.alpha = 0;
        this.vsText.setScale(0);

        let state = 0;
        this.load.on('complete', () => {
            if (state == 0) {
                state = 1;

                this.updateBg();
                this.resize();

                this.homeLogo.setTexture('homeRaceLogo');
                this.homeLogo.alpha = 0;
                this.homeLogo.setScale(0);
                this.add.existing(this.homeLogo);
                this.awayLogo.setTexture('awayRaceLogo');
                this.awayLogo.alpha = 0;
                this.awayLogo.setScale(0);
                this.add.existing(this.awayLogo);

                fadeInTriggered = true;

                this.tweens.add({
                    targets: [this.homeLogo, this.vsText, this.awayLogo],
                    duration: 1000,
                    delay: 0,
                    ease: 'Bounce.easeOut',
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1
                });

                for (let sprite of this.assets["sprites"]) {
                    let key = "/"+sprite;
                    let sheet = this.load.image(key, "https://fumbbl.com/"+sprite);
                    this.spritesheets[key] = "/"+sprite;
                }

                for (let image of this.assets["graphics"]) {
                    this.load.image(image, "https://fumbbl.com/"+image);
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
                this.load.start();
            } else {
                for (let key in this.spritesheets) {
                    let sprite = this.add.sprite(0, 0, key);
                    sprite.visible=false;
                    this.generateSpriteFrames(sprite);

                }

                this.generateTextures();
                
                this.controller.setScene("mainScene");
            }
        });

        this.load.image("loadingscreen", "https://fumbbl.com/i/563852");

        let homeLogoUrl = this.controller.Game.teamHome.getRoster().getLogoUrl();        
        let awayLogoUrl = this.controller.Game.teamAway.getRoster().getLogoUrl();

        if (homeLogoUrl == "i/0") {
            homeLogoUrl = "i/486374";
        }

        if (awayLogoUrl == "i/0") {
            awayLogoUrl = "i/486374";
        }

        this.load.image("homeRaceLogo", "https://fumbbl.com/" + homeLogoUrl);
        this.load.image("awayRaceLogo", "https://fumbbl.com/" + awayLogoUrl);
    }

    private resize() {
        // Calculate center point for loading progress bar
        let centerPointX = this.width / 2 + this.bg.displayWidth * 0.2;
        let centerPointY = this.height / 2 + this.bg.displayHeight * 0.25;

        let barWidth = this.bg.displayWidth * 0.5;
        let barHeight = this.bg.displayHeight * 0.075;

        this.homeLogo.setPosition(centerPointX - barWidth / 4, centerPointY - this.bg.displayHeight * 0.4);
        this.awayLogo.setPosition(centerPointX + barWidth / 4, centerPointY - this.bg.displayHeight * 0.4);

        this.loadingText.setPosition(centerPointX, centerPointY - barHeight * 1.2);
        this.vsText.setPosition(centerPointX, centerPointY - this.bg.displayHeight * 0.4);

        this.progressBox.setPosition(centerPointX - barWidth / 2, centerPointY - barHeight);
        this.progressBox.setDisplaySize(barWidth, barHeight);
        this.progressBox.visible = true;

        this.progressBar.setDisplaySize(0,0);
        this.progressBar.visible = true;

    }

    public create(config) {
        console.log('Boot Scene: create', config);
    }

    public update() {
    }

    private addBg() {
        let bg = this.add.image(this.width/2, this.height/2, "");
        bg.setOrigin(0.5);
        bg.visible = false;
        return bg;
    }

    private updateBg() {
        this.bg.setTexture("loadingscreen");
        let scale = Math.min(this.width / this.bg.width, this.height / this.bg.height);
        this.bg.setScale(scale);
        this.bg.visible = true;
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
