import Game from "../model/game";

export default class CommandGameState {
    private controller;

    public constructor(controller: any) {
        this.controller = controller;
    }

    public processCommand(data: any) {
        console.log("Processing game state command", data);

        let game = new Game(data);
        this.controller.updateGameState(game);
    }
}
