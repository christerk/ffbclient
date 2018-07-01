import Phaser from "phaser";
import * as Scenes from "./scenes";
import Controller from "./controller";
import Network from "./network";
import CommandHandler from "./commandhandler";
import CommandManager from "./model/commandmanager";
import * as Model from "./model";

export default class App extends Phaser.Game {
    constructor() {
        console.log("Starting Phaser App");

        let game = new Model.Game();
        let commandManager = new CommandManager(game);
        let controller = new Controller(game, commandManager);

        commandManager.setController(controller);

        let scenes = [
            new Scenes.ConnectScene(controller),
            new Scenes.BootScene(controller),
            new Scenes.MainScene(controller),
        ];

        let config:GameConfig = {
            parent: 'phaserapp',
            type: Phaser.AUTO,
            width: 960,
            height: 554,
            scene: scenes,
            "render.antialias": false,
            "render.pixelArt": true,
            "render.roundPixels": true
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

        let forwardButton = document.getElementById('forward');
        if (forwardButton != null) {
            forwardButton.addEventListener('click', () => {
                commandManager.moveForward();
            });
        }

        let backButton = document.getElementById('back');
        if (backButton != null) {
            backButton.addEventListener('click', () => {
                commandManager.moveBack();
            });
        }


        let endButton = document.getElementById('end');
        if (endButton != null) {
            endButton.addEventListener('click', () => {
                commandManager.moveToEnd();
            });
        }
    }
}
