import Game from "../model/game";
import Coordinate from "../types/coordinate";
import Controller from "../controller";
import Command from "./command";

type ModelChange = {
    modelChangeId: string,
    modelChangeKey: string,
    modelChangeValue: any
};

export default class CommandModelSync extends Command {
    private handlers: { [id: string] : (ModelChange) => void };

    public constructor(controller: Controller) {
        super(controller);

        this.handlers = {
            "fieldModelSetPlayerCoordinate": this.handleSetPlayerCoordinate
        };
    }

    public processCommand(data: any) {
        console.log("Processing model sync command", data);

        for (let i in data['modelChangeList']['modelChangeArray']) {
            let change:ModelChange = data['modelChangeList']['modelChangeArray'][i];

            let changeId = change['modelChangeId'];
            if (this.handlers[changeId]) {
                this.handlers[changeId].call(this, change);
            } else {
                console.log("Unhandled model change", changeId);
            }
        }
    }

    private handleSetPlayerCoordinate(change: ModelChange) {
        let playerId = change['modelChangeKey'];
        let [x, y] = change['modelChangeValue'];
        let coordinate:Coordinate = new Coordinate(x,y);
        let player = this.controller.movePlayer(playerId, coordinate);
    }
}
