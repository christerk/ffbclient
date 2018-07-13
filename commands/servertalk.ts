import { Command } from ".";
import * as Core from "../core";

export class CommandServerTalk extends Command {
    public constructor(controller: Core.Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerTalk) {
        console.log("Processing server talk command", data);
    }
}
