import { Command } from ".";
import Controller from "../controller";

export class CommandServerSound extends Command {
    public constructor(controller: Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerSound) {
        console.log("Processing server sound command", data);
    }
}
