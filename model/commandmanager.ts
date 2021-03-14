import * as Model from ".";
import * as Core from "../core";
import { AbstractCommand } from "./clientcommands";
import { EventType } from "../types/eventlistener";

export default class CommandManager {
    private game: Model.Game;
    private controller: Core.Controller;

    private commandQueue: AbstractCommand[];
    private queuePosition: number;
    private pauseResolution: (value?: {} | PromiseLike<{}>)=>void;

    private executionQueue: Promise<any>;

    /**
     * The Command Manager is resposible for keeping track of model changes
     * and for moving back and forth in the history.
     */
    public constructor(game: Model.Game) {
        this.game = game;
        this.queuePosition = 0;
        this.commandQueue = [];
        this.executionQueue = Promise.resolve();
        this.pauseResolution = null;
    }

    public setController(controller: Core.Controller) {
        this.controller = controller;
        console.log("Command Manager setting controller", this.controller);
    }

    private applyCommand(command: AbstractCommand, fast: boolean) {
        this.queuePosition++;
        this.executionQueue = this.executionQueue
        .then(() => {
            command.apply(this.game, this.controller);

            let delay = command.getDelay();
            if (fast || delay == 0) {
                return Promise.resolve();
            }

            if (command.triggerModelChanged) {
                // Trigger a model change event to redraw the field if there's a delay on the command.
                this.controller.triggerEvent(EventType.ModelChanged);
            }

            return new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, delay);
            });
        });
    }

    public pause() {
        if (this.pauseResolution == null) {
            this.executionQueue = this.executionQueue
            .then(() => {
                console.log("CommandManager paused");
                return new Promise((resolve, reject) => {
                    this.pauseResolution = resolve;
                });
            });
        }
    }

    public resume() {
        if (this.pauseResolution != null) {
            this.pauseResolution();
            this.pauseResolution = null;
            console.log("CommandManager resumed");
        }
    }

    public enqueueCommand(command: AbstractCommand) {
        // Push the command to the end of the queue
        this.commandQueue.push(command);

        // If we are standing at the end of the queue, we apply
        // the command immediately.
        if (this.queuePosition == this.commandQueue.length - 1) {
            this.applyCommand(command, false);
        }
    }

    public moveToEnd() {
        while (this.queuePosition < this.commandQueue.length) {
            let command = this.commandQueue[this.queuePosition]
            // We need to apply() here as the game may have progressed
            // while we were looking at the history.
            this.applyCommand(command, true);
        }

        this.controller.triggerEvent(EventType.ModelChanged);
    }

    public moveForward() {
        if (this.queuePosition < this.commandQueue.length) {
            let command = this.commandQueue[this.queuePosition]
            // We need to apply() here as the game may have progressed
            // while we were looking at the history.
            this.applyCommand(command, false);

            // Note: This should probably check if there's an actual
            // model change in the command set...
            this.controller.triggerEvent(EventType.ModelChanged);
        }
    }

    public moveBack() {
        if (this.queuePosition > 0) {
            this.queuePosition--;
            this.commandQueue[this.queuePosition].undo();

            // Note: This should probably check if there's an actual
            // model change in the command set...
            this.controller.triggerEvent(EventType.ModelChanged);
        }
    }
}
