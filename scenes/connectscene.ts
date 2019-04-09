import Phaser from "phaser";
import * as Core from "../core";
import { AbstractScene } from "./abstractscene";

export class ConnectScene extends AbstractScene {

    private width: number;
    private height: number;
    private config: any;
    private auth: string;
    private loadingText: Phaser.GameObjects.Text;

    public constructor(controller: Core.Controller) {
        super('connectScene', controller);
    }

    public init(config) {
        this.width = this.sys.canvas.width;
        this.height = this.sys.canvas.height;

        this.config = config;
    }

    public preload() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        this.loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Connecting...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);

        this.controller.connect(this.config);

    }

    public create(config) {
        this.add.existing(this.loadingText);
    }

    public update() {
    }
}
