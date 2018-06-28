import Phaser from "phaser";
import ConnectScene from "./scenes/connectscene";
import BootScene from "./scenes/bootscene";
import MainScene from "./scenes/mainscene";
import Controller from "./controller";
import Network from "./network";
import CommandHandler from "./commandhandler";
import CommandManager from "./model/commandmanager";
import Game from "./model/game";

export default class App extends Phaser.Game {
    constructor() {
        console.log("Starting Phaser App");

        let game = new Game();
        let commandManager = new CommandManager(game);
        let controller = new Controller(game, commandManager);

        commandManager.setController(controller);

        let scenes = [
            new ConnectScene(controller),
            new BootScene(controller),
            new MainScene(controller),
        ];

        let config:GameConfig = {
            parent: 'phaserapp',
            type: Phaser.AUTO,
            width: 960,
            height: 554,
            scene: scenes,
            "render.pixelArt": true
        };
        super(config);

        controller.scene = this.scene;

        let el = document.getElementById('wrapper');
        let user = el.getAttribute('user');
        let auth = el.getAttribute('auth');
        let gameAttr = el.getAttribute('game');

        controller.setScene('connectScene', {
            user: user,
            auth: auth,
            gameId: gameAttr
        });

        let fullscreenButton = document.getElementById('fullscreen');
        if (fullscreenButton != null) {
            fullscreenButton.addEventListener('click', () => {
                this.canvas[this.device.fullscreen.request]();
            });
        }
        
        let quitButton = document.getElementById('quit');
        if (quitButton != null) {
            quitButton.addEventListener('click', () => {
                controller.disconnect();
                super.destroy(true);
            });
        }
    }
}
