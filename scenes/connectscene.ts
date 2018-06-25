import Phaser from "phaser"

export default class ConnectScene extends Phaser.Scene {

    private controller: any;
    private width: number;
    private height: number;
    private config: any;
    private auth: string;

    public constructor(controller: any) {
        super({
            key: 'connectScene',
            active: false,
        });
        console.log("Connect Scene: constructed");
        this.controller = controller;
    }

    public init(config) {
        console.log('Connect Scene: init', config);

        this.controller.scene = this.scene;

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
