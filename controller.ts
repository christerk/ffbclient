import Network from "./network";
import CommandHandler from "./commandhandler";
import Game from "./model/game";
import Coordinate from "./types/coordinate";
import { AbstractCommand } from "./model/clientcommands";
import CommandManager from "./model/commandmanager";

export default class Controller {
    private currentScene: string;
    public scene;
    private game: Game;
    private commandManager: CommandManager;

    /**
     * Core message passing class. Used to interface between the network and
     * the core model.
     */
    public constructor(game: Game, commandManager: CommandManager) {
        this.commandManager = commandManager;
        this.game = game;
    }

    public setScene(scene: string, data: any = undefined) {
        console.log("Setting Scene: " + scene);
        if (this.currentScene) {
            this.scene.stop(this.currentScene);
        }
        this.scene.start(scene, data);
        this.currentScene = scene;
    }

    public updateGameState(game: Game) {
        console.log("updateGameState", game);
        this.game = game;
        this.setScene('bootScene', { game: game });
    }

    public enqueueCommand(command: AbstractCommand) {
        this.commandManager.enqueueCommand(command);
        this.game.dirty = true;
    }

    public getGameState() {
        return this.game;
    }

    public connect(config: any) {
        let network = new Network();
        let commandHandler = new CommandHandler(network, this);
        network.connect(commandHandler, config);
    }
}
