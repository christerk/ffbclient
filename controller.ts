import Network from "./network";
import CommandHandler from "./commandhandler";
import * as Model from "./model";
import { Coordinate } from "./types";
import { AbstractCommand } from "./model/clientcommands";
import CommandManager from "./model/commandmanager";
import { EventListener, EventType } from "./types/eventlistener";
import { DiceManager } from "./dicemanager";
import { AbstractScene } from "./scenes/abstractscene";
import { SoundEngine } from "./soundengine";

export default class Controller {
    private currentScene: string;
    private sceneManager: Phaser.Scenes.SceneManager;
    public scene: Phaser.Scene;
    private game: Model.Game;
    private commandManager: CommandManager;
    private soundEngine: SoundEngine;
    private eventListeners: EventListener[];
    private network: Network;
    private diceManager: DiceManager;
    private scenes: { [key: string]: Phaser.Scene }
    private scale: number;
    private blockedSquares: { [key: string] : Coordinate[] };

    /**
     * Core message passing class. Used to interface between the network and
     * the core model.
     */
    public constructor(game: Model.Game, commandManager: CommandManager, soundEngine: SoundEngine) {
        this.commandManager = commandManager;
        this.soundEngine = soundEngine;
        this.game = game;
        this.eventListeners = [];
        this.scenes = {};
        this.network = new Network();
        this.diceManager = new DiceManager(this);
        this.scale = 30;
        this.blockedSquares = {};
    }

    public handleEvent(event: EventType, data?: any) {
        switch(event) {
            case EventType.Connected:
                this.commandManager.pause();
                break;
            case EventType.Initialized:
                this.commandManager.resume();
                break;
            case EventType.Resized:
                console.log(data);
                this.scale = data.scale;
                break;
        }
    }

    public get Game(): Model.Game {
        return this.game;
    }

    public get SoundEngine(): SoundEngine {
        return this.soundEngine;
    }

    public setSceneManager(sceneManager: Phaser.Scenes.SceneManager) {
        this.sceneManager = sceneManager;
    }

    public registerScene(scene: AbstractScene) {
        console.log("Registering scene", scene.sys.settings.key);
        this.scenes[scene.sys.settings.key] = scene;
    }

    public getScene(key: string) {
        return this.scenes[key];
    }

    public get DiceManager(): DiceManager {
        return this.diceManager;
    }

    public addEventListener(listener: EventListener) {
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

    public enqueueCommand(command: AbstractCommand) {
        this.commandManager.enqueueCommand(command);

        console.log('Command enqueued', command);

        if (command.triggerModelChanged == true) {
            this.triggerEvent(EventType.ModelChanged);
        }
    }

    public sendChat(text: string) {
        if (text.length > 0) {
            this.network.sendChat(text);
        }
    }

    public triggerEvent(eventType: EventType, data?: any) {
        this.handleEvent(eventType, data);
        this.eventListeners.forEach((listener) => listener.handleEvent(eventType, data));
    }

    public getGameState() {
        return this.game;
    }

    public connect(config: any) {
        let commandHandler = new CommandHandler(this.network, this);
        this.network.connect(commandHandler, config);
    }

    public disconnect() {
        this.network.leave();
    }

    public convertToPixels(coordinate: Coordinate) {
        return [
            Math.round(coordinate.x * this.scale),
            Math.round(coordinate.y * this.scale)
        ];
    }

    public findEmptyPatchNearLocation(coordinate: Coordinate, width: number, height: number): Coordinate {
        let blocked: Coordinate[] = [];
        for (let key in this.blockedSquares) {
            if (this.blockedSquares[key]) {
                blocked = blocked.concat(this.blockedSquares[key]);
            }
        }
        console.log("Finding location", blocked, this.blockedSquares);
        return this.game.findEmptyPatchNearLocation(coordinate, width, height, blocked);
    }

    public allocateBoardSpace(coordinate: Coordinate, width: number, height: number): string {
        let key = "roll:" + coordinate.x + ":" + coordinate.y + ":" + width + ":" + height;
        let squares: Coordinate[] = [];
        
        for (let y=0; y<height; y++) {
            for (let x=0; x<width; x++) {
                squares.push(coordinate.add(x, y));
            }
        }

        console.log("Allocated location", key);

        this.blockedSquares[key] = squares;

        return key;
    }

    public freeBoardSpace(key: string) {
        console.log("Freeing location", key);
        delete this.blockedSquares[key];
    }
}
