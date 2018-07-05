import Phaser from "phaser"
import Controller from "../controller";
import { AbstractScene } from "./abstractscene";

export class BootScene extends AbstractScene {

    private width: number;
    private height: number;
    private assets;
    private spritesheets;
    private phase;
    private loadingText;

    public constructor(controller: Controller) {
        super('bootScene', controller);
        console.log("Boot Scene: constructed");
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
        console.log('Boot Scene: preload');

        for (let sprite of this.assets['sprites']) {
            let key = ('sprite_'+sprite).replace(/[/]/g,'_');
            let sheet = this.load.image(key, 'https://fumbbl.com/'+sprite);
            this.spritesheets[key] = '/'+sprite;
        }

        this.load.image("pitch", "https://fumbbl.com/i/561518");
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

        this.initialize();
    }

    public create(config) {
        console.log('Boot Scene: create', config);


    }

    public update() {
        console.log('Boot Scene: update');
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
            text: 'Loading assets...',
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

            if (this.phase == 1) {
                this.loadingText.setText("Processing sprite sheets...");
                this.phase = 2;
                for (let key in this.spritesheets) {
                    let img = this.add.image(0, 0, key);
                    img.visible=false;

                    this.load.spritesheet(this.spritesheets[key], 'https://fumbbl.com'+this.spritesheets[key], {
                        frameWidth: img.width/4
                    });
                }
                this.load.start();
            } else {
                this.controller.setScene('mainScene');
            }
        });
    }
}
