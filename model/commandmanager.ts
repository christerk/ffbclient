import Game from './game';
import Controller from '../controller';
import { AbstractCommand } from './clientcommands'

export default class CommandManager {
    private game: Game;
    private controller: Controller;

    private commandQueue: AbstractCommand[];
    private queuePosition: number;

    /**
     * The Command Manager is resposible for keeping track of model changes
     * and for moving back and forth in the history.
     */
    public constructor(game: Game) {
        this.game = game;
        this.queuePosition = 0;
        this.commandQueue = [];
    }

    public setController(controller: Controller) {
        this.controller = controller;
    }

    public enqueueCommand(command: AbstractCommand) {
        // Push the command to the end of the queue
        this.commandQueue.push(command);

        // If we are standing at the end of the queue, we apply
        // the command immediately.
        if (this.queuePosition == this.commandQueue.length - 1) {
            command.apply(this.game);
            this.queuePosition++;
        }
    }
}
