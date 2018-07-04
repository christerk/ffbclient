import { Coordinate } from "../types";
import Controller from "../controller";
import Command from "./command";
import * as ClientCommands from "../model/clientcommands";

export default class CommandModelSync extends Command {
    private handlers: { [id: string] : (ModelChange) => ClientCommands.AbstractCommand };
    private reportHandlers: { [id: string] : (Report) => ClientCommands.AbstractCommand };

    public constructor(controller: Controller) {
        super(controller);

        this.handlers = {
            "fieldModelAddMoveSquare": this.handleAddMoveSquare,
            "fieldModelRemoveMoveSquare": this.handleRemoveMoveSquare,
            "fieldModelAddTrackNumber": this.handleAddTrackNumber,
            "fieldModelRemoveTrackNumber": this.handleRemoveTrackNumber,
            "fieldModelSetPlayerCoordinate": this.handleSetPlayerCoordinate,
            "fieldModelSetPlayerState": this.handleSetPlayerState,
            "fieldModelSetBallCoordinate": this.handleSetBallCoordinate,
        };

        this.reportHandlers = {
            "blockRoll": this.handleBlockRollReport,
            "goForItRoll": this.handleGoForItReport,
        }
    }

    public processCommand(data: FFB.Protocol.Messages.ServerModelSync) {
        console.log("Processing model sync command", data);

        let compoundCommand = new ClientCommands.CompoundCommand();

        for (let report of data.reportList.reports) {
            let reportId = report.reportId;
            if (this.reportHandlers[reportId]) {
                let command: ClientCommands.AbstractCommand = this.reportHandlers[reportId].call(this, report);
                compoundCommand.addCommand(command);
            } else {
                console.log("Unhandled report", reportId);
            }
        }

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

    private handleSetBallCoordinate(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let value = <FFB.Protocol.Messages.Coordinate>change.modelChangeValue;
        let coordinate = Coordinate.FromArray(value);
        return new ClientCommands.SetBallCoordinate(coordinate);
    }

    private handleAddMoveSquare(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let value = <FFB.Protocol.Messages.MoveSquare>change.modelChangeValue;
        let coordinate = Coordinate.FromArray(value.coordinate);
        return new ClientCommands.AddMoveSquare(coordinate);
    }

    private handleRemoveMoveSquare(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let value = <FFB.Protocol.Messages.MoveSquare>change.modelChangeValue;
        let coordinate = Coordinate.FromArray(value.coordinate);
        return new ClientCommands.RemoveMoveSquare(coordinate);
    }

    private handleAddTrackNumber(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let value = <FFB.Protocol.Messages.TrackNumberType>change.modelChangeValue;
        let trackNumber = value.number;
        let coordinate = Coordinate.FromArray(value.coordinate);
        return new ClientCommands.AddTrackNumber(trackNumber, coordinate);
    }

    private handleRemoveTrackNumber(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let value = <FFB.Protocol.Messages.TrackNumberType>change.modelChangeValue;
        let trackNumber = value.number;
        let coordinate = Coordinate.FromArray(value.coordinate);
        return new ClientCommands.RemoveTrackNumber(trackNumber, coordinate);
    }

    private handleSetPlayerCoordinate(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let value = <FFB.Protocol.Messages.Coordinate>change.modelChangeValue;
        let playerId = change.modelChangeKey;
        let coordinate = Coordinate.FromArray(value);

        return new ClientCommands.MovePlayer(playerId, coordinate);
    }

    private handleSetPlayerState(change: FFB.Protocol.Messages.ModelChangeType): ClientCommands.AbstractCommand {
        let value = <string>change.modelChangeValue;
        let playerId = change.modelChangeKey;
        let state = parseInt(value);

        return new ClientCommands.SetPlayerState(playerId, state);
    }

    private handleBlockRollReport(report: FFB.Protocol.Messages.BlockRollReport): ClientCommands.AbstractCommand {
        return new ClientCommands.BlockRoll(report.blockRoll);
    }

    private handleGoForItReport(report: FFB.Protocol.Messages.GoForItReport): ClientCommands.AbstractCommand {
        return new ClientCommands.GoForItRoll(report.roll);
    }
}
