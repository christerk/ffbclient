import Game from "../model/game";
import Command from "./command";
import Controller from "../controller";

export default class CommandGameState extends Command {
    public constructor(controller: Controller) {
        super(controller);
    }

    public processCommand(data: any) {
        console.log("Processing game state command", data);

        let game = new Game(data);
        this.controller.updateGameState(game);
    }
}
