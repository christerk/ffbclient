import { Command } from ".";
import Controller from "../controller";

export class CommandServerTalk extends Command {
    public constructor(controller: Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerTalk) {
        console.log("Processing server talk command", data);
    }
}
