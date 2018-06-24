import Game from "../model/game";
import Command from "./command";
import Controller from "../controller";
import * as ClientCommands from "../model/clientcommands";

export default class CommandGameState extends Command {
    public constructor(controller: Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerGameState) {
        console.log("Processing game state command", data);

        this.controller.enqueueCommand(new ClientCommands.Initialize(data));
        this.controller.setScene('bootScene');
    }
}
