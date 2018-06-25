import Game from "../model/game";
import Controller from "../controller";
import Command from "./command";

export default class CommandGameTime extends Command {
    public constructor(controller: Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerGameTime) {
    }
}
