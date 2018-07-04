import Network from "./network";
import CommandHandler from "./commandhandler";
import * as Model from "./model";
import { Coordinate } from "./types";
import { AbstractCommand } from "./model/clientcommands";
import CommandManager from "./model/commandmanager";
import { EventListener, EventType } from "./types/eventlistener";
import { DiceManager } from "./dicemanager";
import { AbstractScene } from "./scenes/abstractscene";

export default class Controller {
    private currentScene: string;
    private sceneManager: Phaser.Scenes.SceneManager;
    public scene: Phaser.Scene;
    private game: Model.Game;
    private commandManager: CommandManager;
    private eventListeners: EventListener[];
    private network: Network;
    private diceManager: DiceManager;
    private scenes: { [key: string]: Phaser.Scene }

    /**
     * Core message passing class. Used to interface between the network and
     * the core model.
     */
    public constructor(game: Model.Game, commandManager: CommandManager) {
        this.commandManager = commandManager;
        this.game = game;
        this.eventListeners = [];
        this.scenes = {};
        this.network = new Network();
        this.diceManager = new DiceManager();
    }

    public get Game(): Model.Game {
        return this.game;
    }

    public setSceneManager(sceneManager: Phaser.Scenes.SceneManager) {
        this.sceneManager = sceneManager;
    }

    public registerScene(scene: AbstractScene) {
        console.log("Registering scene", scene.sys.settings.key);
        this.scenes[scene.sys.settings.key] = scene;
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

    public triggerEvent(eventType: EventType, data?: any) {
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
}
