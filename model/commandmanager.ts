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

    public moveToEnd() {
        while (this.queuePosition < this.commandQueue.length) {
            let command = this.commandQueue[this.queuePosition]
            // We need to apply() here as the game may have progressed
            // while we were looking at the history.
            command.apply(this.game);
            this.queuePosition++;
        }

        this.controller.triggerModelChange();
    }

    public moveForward() {
        if (this.queuePosition < this.commandQueue.length) {
            let command = this.commandQueue[this.queuePosition]
            // We need to apply() here as the game may have progressed
            // while we were looking at the history.
            command.apply(this.game);
            this.queuePosition++;

            // Note: This should probably check if there's an actual
            // model change in the command set...
            this.controller.triggerModelChange();
        }
    }

    public moveBack() {
        if (this.queuePosition > 0) {
            this.queuePosition--;
            this.commandQueue[this.queuePosition].undo();

            // Note: This should probably check if there's an actual
            // model change in the command set...
            this.controller.triggerModelChange();
        }
    }
}
