import Game from "../model/game";
import Coordinate from "../types/coordinate";
import Controller from "../controller";
import Command from "./command";
import * as ClientCommands from "../model/clientcommands";

export default class CommandModelSync extends Command {
    private handlers: { [id: string] : (ModelChange) => void };

    public constructor(controller: Controller) {
        super(controller);

        this.handlers = {
            "fieldModelAddMoveSquare": this.handleAddMoveSquare,
            "fieldModelRemoveMoveSquare": this.handleRemoveMoveSquare,
            "fieldModelAddTrackNumber": this.handleAddTrackNumber,
            "fieldModelRemoveTrackNumber": this.handleRemoveTrackNumber,
            "fieldModelSetPlayerCoordinate": this.handleSetPlayerCoordinate,
            "fieldModelSetPlayerState": this.handleSetPlayerState,
        };
    }

    public processCommand(data: FFB.Protocol.Messages.ServerModelSync) {
        console.log("Processing model sync command", data);

        let compoundCommand = new ClientCommands.CompoundCommand();
        for (let change of data.modelChangeList.modelChangeArray) {
            let changeId = change.modelChangeId;
            if (this.handlers[changeId]) {
                let command: ClientCommands.AbstractCommand = this.handlers[changeId].call(this, change);
                compoundCommand.addCommand(command);
            } else {
                console.log("Unhandled model change", changeId);
            }
        }
        this.controller.enqueueCommand(compoundCommand);
    }

    private handleAddMoveSquare(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let [x,y] = change.modelChangeValue.coordinate;
        let coordinate = new Coordinate(x, y);
        return new ClientCommands.AddMoveSquare(coordinate);
    }

    private handleRemoveMoveSquare(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let [x,y] = change.modelChangeValue.coordinate;
        let coordinate = new Coordinate(x, y);
        return new ClientCommands.RemoveMoveSquare(coordinate);
    }

    private handleAddTrackNumber(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let [x,y] = change.modelChangeValue.coordinate;
        let trackNumber = change.modelChangeValue.number;
        let coordinate = new Coordinate(x, y);
        return new ClientCommands.AddTrackNumber(trackNumber, coordinate);
    }

    private handleRemoveTrackNumber(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let [x,y] = change.modelChangeValue.coordinate;
        let trackNumber = change.modelChangeValue.number;
        let coordinate = new Coordinate(x, y);
        return new ClientCommands.RemoveTrackNumber(trackNumber, coordinate);
    }

    private handleSetPlayerCoordinate(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let playerId = change.modelChangeKey;
        let [x, y] = change.modelChangeValue;
        let coordinate = new Coordinate(x,y);

        return new ClientCommands.MovePlayer(playerId, coordinate);
    }

    private handleSetPlayerState(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let playerId = change.modelChangeKey;
        let state = parseInt(change.modelChangeValue);

        return new ClientCommands.SetPlayerState(playerId, state);
    }
}
