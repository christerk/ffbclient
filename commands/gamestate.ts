import { Command } from ".";
import * as Core from "../core";
import * as ClientCommands from "../model/clientcommands";

export class CommandGameState extends Command {
    public constructor(controller: Core.Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerGameState) {
        console.log("Processing game state command", data);

        this.controller.enqueueCommand(new ClientCommands.Initialize(data));
    }
}
