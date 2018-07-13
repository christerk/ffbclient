import { Command } from ".";
import * as Core from "../core";

export class CommandServerSound extends Command {
    public constructor(controller: Core.Controller) {
        super(controller);
    }

    public processCommand(data: FFB.Protocol.Messages.ServerSound) {
        console.log("Processing server sound command", data);
        
        this.controller.SoundEngine.play(data.sound);
    }
}
