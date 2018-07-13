import * as Commands from "../commands";
import * as Core from ".";

export class CommandHandler {
    private commandHandlers: {[id:string]:Commands.Command};
    private network: Core.Network;
    private controller: Core.Controller;

    public constructor(network: Core.Network, controller: Core.Controller) {
        this.commandHandlers = {
            "serverGameState": new Commands.CommandGameState(controller),
            "serverModelSync": new Commands.CommandModelSync(controller),
            "serverGameTime": new Commands.CommandGameTime(controller),
            "serverTalk": new Commands.CommandServerTalk(controller),
            "serverSound": new Commands.CommandServerSound(controller),
        };
        this.network = network;
        this.controller = controller;
    }

    public handleCommand(data: any) {
        let commandId = data.netCommandId;

        let handler = this.commandHandlers[commandId];
        if (handler) {
            handler.processCommand(data);
        } else {
            console.log("Unknown command", commandId, data);
        }
    }
}
