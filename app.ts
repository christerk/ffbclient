import Phaser from "phaser";
import ConnectScene from "./scenes/connectscene";
import BootScene from "./scenes/bootscene";
import MainScene from "./scenes/mainscene";
import Controller from "./controller";
import Network from "./network";
import CommandHandler from "./commandhandler";

export default class App extends Phaser.Game {
    constructor() {
        console.log("Starting Phaser App");

        let controller = new Controller();

        let connectScene = new ConnectScene(controller);
        let bootScene = new BootScene(controller);
        let mainScene = new MainScene(controller);

        let config:GameConfig = {
            parent: 'phaserapp',
            type: Phaser.AUTO,
            width: 960,
            height: 554,
            scene: [ connectScene, bootScene, mainScene ],
            "render.pixelArt": true
        };
        super(config);

        controller.scene = this.scene;

        let el = document.getElementById('wrapper');
        let user = el.getAttribute('user');
        let auth = el.getAttribute('auth');
        let game = el.getAttribute('game');

        controller.setScene('connectScene', {
            user: user,
            auth: auth,
            game: game
        });

        let fullscreenButton = document.getElementById('fullscreen');
        fullscreenButton.addEventListener('click', () => {
            this.canvas[this.device.fullscreen.request]();
        });

    }
}
