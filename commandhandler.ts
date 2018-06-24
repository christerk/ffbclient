import CommandGameState from "./commands/gamestate";
import CommandModelSync from "./commands/modelsync";
import CommandGameTime from "./commands/gametime";
import Network from "./network";

export default class CommandHandler {
    private commandHandlers;
    private network;
    private controller;

    public constructor(network: any, controller: any) {
        this.commandHandlers = {
            "serverGameState": new CommandGameState(controller),
            "serverModelSync": new CommandModelSync(controller),
            "serverGameTime": new CommandGameTime(controller),
        };
        this.network = network;
        this.controller = controller;
    }

    public connected() {
        this.network.join();
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
