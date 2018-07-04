import Phaser from "phaser"
import Controller from "../controller";
import { AbstractScene } from "./abstractscene";

export class ConnectScene extends AbstractScene {

    private width: number;
    private height: number;
    private config: any;
    private auth: string;

    public constructor(controller: Controller) {
        super('connectScene', controller);
        console.log("Connect Scene: constructed");
    }

    public init(config) {
        console.log('Connect Scene: init', config);

        this.width = this.sys.canvas.width;
        this.height = this.sys.canvas.height;

        this.config = config;
    }

    public preload() {
        console.log('Connect Scene: preload');

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Connecting...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.controller.connect(this.config);
    }

    public create(config) {
        console.log('Connect Scene: create', config);
    }

    public update() {
        console.log('Connect Scene: update');
    }
}
