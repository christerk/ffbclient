import Phaser from "phaser";
import * as Core from "./core";
import * as Scenes from "./scenes";
import CommandManager from "./model/commandmanager";
import * as Model from "./model";
import { EventListener, EventType } from "./types/eventlistener";
import { AbstractScene } from "./scenes/abstractscene";

export default class App extends Phaser.Game implements EventListener {
    private static controller: Core.Controller;
    private restartCallback: () => void;

    public constructor(restartCallback: () => void) {
        console.log("Starting Phaser App");


        let game = new Model.Game();
        let commandManager = new CommandManager(game);
        let soundEngine = new Core.SoundEngine();
        let controller = new Core.Controller(game, commandManager, soundEngine);
        App.controller = controller;
        commandManager.setController(controller);
        soundEngine.setController(controller);

        let scenes: AbstractScene[] = [
            new Scenes.ConnectScene(controller),
            new Scenes.BootScene(controller),
            new Scenes.MainScene(controller),
        ];

        let config:GameConfig = {
            parent: 'phaserapp',
            type: Phaser.CANVAS,
            width: 960,
            height: 540,
            scene: <Phaser.Scene[]>scenes,
            "render.antialias": true,
            "render.pixelArt": false,
            "render.roundPixels": false,
            fps: {
                target: 60,
            }
        };
        super(config);
        this.restartCallback = restartCallback;

        controller.setSceneManager(this.scene);

        for (let scene of scenes) {
            controller.registerScene(scene);
        }

        let el = document.getElementById('wrapper');
        let user = el.getAttribute('user');
        let auth = el.getAttribute('auth');
        let gameAttr = el.getAttribute('game');

        controller.setScene("connectScene", {
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

        setTimeout(() => {
            this.initialize();
        }, 1);
    }

    private initialize() {
        App.controller.addEventListener(this);
    }

    public handleEvent(eventType: EventType, data: any) {
        switch(eventType) {
            case EventType.FullScreen: this.canvas[this.device.fullscreen.request](); break;
            case EventType.Quit:
                setTimeout(this.restartCallback, 1);
                App.controller.disconnect();
                super.destroy(true); break;
        }
    }
}
