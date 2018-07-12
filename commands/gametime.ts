import Controller from "../controller";
import { Command } from ".";

export class CommandGameTime extends Command {
    public constructor(controller: Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerGameTime) {
    }
}
