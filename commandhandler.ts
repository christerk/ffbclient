import CommandGameState from "./commands/gamestate";
import CommandModelSync from "./commands/modelsync";
import CommandGameTime from "./commands/gametime";
import Command from "./commands/command";
import Network from "./network";
import Controller from "./controller";

export default class CommandHandler {
    private commandHandlers: {[id:string]:Command};
    private network: Network;
    private controller: Controller;

    public constructor(network: Network, controller: Controller) {
        this.commandHandlers = {
            "serverGameState": new CommandGameState(controller),
            "serverModelSync": new CommandModelSync(controller),
            "serverGameTime": new CommandGameTime(controller),
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
