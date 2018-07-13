import * as Core from "../core";
import { Command } from ".";

export class CommandGameTime extends Command {
    public constructor(controller: Core.Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerGameTime) {
    }
}
