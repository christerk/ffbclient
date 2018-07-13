import * as Core from ".";
import * as Model from "../model";
import * as Types from "../types";
import * as ClientCommands from "../model/clientcommands";
import CommandManager from "../model/commandmanager";
import * as Scenes from "../scenes";

export class Controller {
    private currentScene: string;
    private sceneManager: Phaser.Scenes.SceneManager;
    public scene: Phaser.Scene;
    private game: Model.Game;
    private commandManager: CommandManager;
    private soundEngine: Core.SoundEngine;
    private eventListeners: Types.EventListener[];
    private network: Core.Network;
    private diceManager: Core.DiceManager;
    private scenes: { [key: string]: Phaser.Scene }
    private scale: number;
    private blockedSquares: { [key: string] : Types.Coordinate[] };

    /**
     * Core message passing class. Used to interface between the network and
     * the core model.
     */
    public constructor(game: Model.Game, commandManager: CommandManager, soundEngine: Core.SoundEngine) {
        this.commandManager = commandManager;
        this.soundEngine = soundEngine;
        this.game = game;
        this.eventListeners = [];
        this.scenes = {};
        this.network = new Core.Network();
        this.diceManager = new Core.DiceManager(this);
        this.scale = 30;
        this.blockedSquares = {};
    }

    public handleEvent(event: Types.EventType, data?: any) {
        switch(event) {
            case Types.EventType.Connected:
                this.commandManager.pause();
                break;
            case Types.EventType.Initialized:
                this.commandManager.resume();
                break;
            case Types.EventType.Resized:
                console.log(data);
                this.scale = data.scale;
                break;
        }
    }

    public get Game(): Model.Game {
        return this.game;
    }

    public get SoundEngine(): Core.SoundEngine {
        return this.soundEngine;
    }

    public setSceneManager(sceneManager: Phaser.Scenes.SceneManager) {
        this.sceneManager = sceneManager;
    }

    public registerScene(scene: Scenes.AbstractScene) {
        console.log("Registering scene", scene.sys.settings.key);
        this.scenes[scene.sys.settings.key] = scene;
    }

    public getScene(key: string) {
        return this.scenes[key];
    }

    public get DiceManager(): Core.DiceManager {
        return this.diceManager;
    }

    public addEventListener(listener: Types.EventListener) {
        this.eventListeners.push(listener);
    }

    public setScene(scene: string, data: any = undefined) {
        console.log("Setting Scene: " + scene, data);

        if (this.currentScene) {
            this.sceneManager.stop(this.currentScene);
        }
        this.sceneManager.start(scene, data);
        this.scene = this.scenes[scene];
        this.currentScene = scene;

        this.diceManager.setScene(this.scenes[scene]);
    }

    public enqueueCommand(command: ClientCommands.AbstractCommand) {
        this.commandManager.enqueueCommand(command);

        console.log('Command enqueued', command);

        if (command.triggerModelChanged == true) {
            this.triggerEvent(Types.EventType.ModelChanged);
        }
    }

    public sendChat(text: string) {
        if (text.length > 0) {
            this.network.sendChat(text);
        }
    }

    public triggerEvent(eventType: Types.EventType, data?: any) {
        this.handleEvent(eventType, data);
        this.eventListeners.forEach((listener) => listener.handleEvent(eventType, data));
    }

    public getGameState() {
        return this.game;
    }

    public connect(config: any) {
        let commandHandler = new Core.CommandHandler(this.network, this);
        this.network.connect(commandHandler, config);
    }

    public disconnect() {
        this.network.leave();
    }

    public convertToPixels(coordinate: Types.Coordinate) {
        return [
            Math.round(coordinate.x * this.scale),
            Math.round(coordinate.y * this.scale)
        ];
    }

    public findEmptyPatchNearLocation(coordinate: Types.Coordinate, width: number, height: number): Types.Coordinate {
        let blocked: Types.Coordinate[] = [];
        for (let key in this.blockedSquares) {
            if (this.blockedSquares[key]) {
                blocked = blocked.concat(this.blockedSquares[key]);
            }
        }
        return this.game.findEmptyPatchNearLocation(coordinate, width, height, blocked);
    }

    public allocateBoardSpace(coordinate: Types.Coordinate, width: number, height: number): string {
        let key = "roll:" + coordinate.x + ":" + coordinate.y + ":" + width + ":" + height;
        let squares: Types.Coordinate[] = [];
        
        for (let y=0; y<height; y++) {
            for (let x=0; x<width; x++) {
                squares.push(coordinate.add(x, y));
            }
        }

        this.blockedSquares[key] = squares;

        return key;
    }

    public freeBoardSpace(key: string) {
        delete this.blockedSquares[key];
    }
}
