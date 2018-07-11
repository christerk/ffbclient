
import * as Model from ".";
import { Coordinate, EventType } from "../types";
import Controller from "../controller";
import { DiceManager, DieType } from "../dicemanager";

export abstract class AbstractCommand {
    protected applied: boolean;
    protected game: Model.Game;
    protected controller: Controller;
    public triggerModelChanged: boolean;

    public constructor() {
        this.applied = false;
        this.triggerModelChanged = true;
        this.controller = null;
    }

    public apply(game: Model.Game, controller: Controller) {
        if (!this.applied) {
            this.game = game;
            this.controller = controller;
            this.applied = true;
            this.init(game, controller);
        }

        this.do();
    }

    public init(game: Model.Game, controller: Controller) {
        this.game = game;
        this.controller = controller;
    }

    public setGame(game: Model.Game) {
        this.game = game;
    }

    protected getLocation(playerIds: string[]) {
        for (let id of playerIds) {
            let p = this.game.getPlayer(id);
            if (p && p.isOnField()) {
                return p.getPosition();
            }
        }

        let p = this.game.getActivePlayer();
        if (p && p.isOnField())
            return p.getPosition();

        return new Coordinate(13, 7);
    }

    public abstract do(): void;
    public abstract undo(): void;
}

export class CompoundCommand extends AbstractCommand {
    private commandList: AbstractCommand[];

    public constructor() {
        super();
        this.commandList = [];
    }

    public addCommand(command: AbstractCommand) {
        this.commandList.push(command);
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        for (let command of this.commandList) {
            command.setGame(this.game);
            command.init(game, controller);
        }
    }

    public do() {
        for (let command of this.commandList) {
            command.do();
        }
    }

    public undo() {
        for (let command of this.commandList.reverse()) {
            command.undo();
        }
    }
}

export class Initialize extends AbstractCommand {
    private data;

    public constructor(data: FFB.Protocol.Messages.ServerGameState) {
        super();
        this.data = data;
    }

    public do() {
        let firstInit = this.game.initialize(this.data);
        if (firstInit) {
            this.controller.setScene('bootScene');
        }
    }

    public undo() {
    }
}

abstract class PlayerCommand extends AbstractCommand {
    protected player: Model.Player;
    protected playerId: string;

    public constructor(playerId: string) {
        super();
        this.playerId = playerId;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        this.player = this.game.getPlayer(this.playerId);
    }

    public abstract do(): void;
    public abstract undo(): void;

}

export class MovePlayer extends PlayerCommand {
    private oldCoordinate: Coordinate;
    private newCoordinate: Coordinate;

    public constructor(playerId:string, coordinate: Coordinate) {
        super(playerId);
        this.newCoordinate = coordinate;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        this.oldCoordinate = this.player.getPosition();
    }

    public do() {
        this.player.setPosition(this.newCoordinate);
    }

    public undo() {
        this.player.setPosition(this.oldCoordinate);
    }
}

export class SetPlayerState extends PlayerCommand {
    private newState: Model.PlayerState;
    private oldState: Model.PlayerState;

    public constructor(playerId: string, newState: Model.PlayerState) {
        super(playerId);
        this.newState = newState;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        this.oldState = this.player.state;
    }

    public do() {
        this.player.setState(this.newState);
    }

    public undo() {
        this.player.setState(this.oldState);
    }
}

export class AddMoveSquare extends AbstractCommand {
    private coordinate: Coordinate;
    private hasMoveSquare: boolean;

    public constructor(coordinate: Coordinate) {
        super();
        this.coordinate = coordinate;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        this.hasMoveSquare = this.game.hasMoveSquare(this.coordinate);
    }

    public do() {
        if (!this.hasMoveSquare) {
            this.game.addMoveSquare(this.coordinate);
        }
    }

    public undo() {
        if (!this.hasMoveSquare) {
            this.game.removeMoveSquare(this.coordinate);
        }
    }
}

export class RemoveMoveSquare extends AbstractCommand {
    private coordinate: Coordinate;
    private hasMoveSquare: boolean;

    public constructor(coordinate: Coordinate) {
        super();
        this.coordinate = coordinate;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        this.hasMoveSquare = this.game.hasMoveSquare(this.coordinate);
    }

    public do() {
        if (this.hasMoveSquare) {
            this.game.removeMoveSquare(this.coordinate);
        }
    }

    public undo() {
        if (this.hasMoveSquare) {
            this.game.addMoveSquare(this.coordinate);
        }
    }
}

export class AddTrackNumber extends AbstractCommand {
    private coordinate: Coordinate;
    private hasTrackNumber: boolean;

    public constructor(trackNumber: number, coordinate: Coordinate) {
        super();
        this.coordinate = coordinate;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        this.hasTrackNumber = this.game.hasTrackNumber(this.coordinate);
    }

    public do() {
        if (!this.hasTrackNumber) {
            this.game.addTrackNumber(this.coordinate);
        }
    }

    public undo() {
        if (!this.hasTrackNumber) {
            this.game.removeTrackNumber(this.coordinate);
        }
    }
}

export class RemoveTrackNumber extends AbstractCommand {
    private coordinate: Coordinate;
    private hasTrackNumber: boolean;

    public constructor(trackNumber: number, coordinate: Coordinate) {
        super();
        this.coordinate = coordinate;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        this.hasTrackNumber = this.game.hasTrackNumber(this.coordinate);
    }

    public do() {
        if (this.hasTrackNumber) {
            this.game.removeTrackNumber(this.coordinate);
        }
    }

    public undo() {
        if (this.hasTrackNumber) {
            this.game.addTrackNumber(this.coordinate);
        }
    }
}

export class SetBallCoordinate extends AbstractCommand {
    private coordinate: Coordinate;
    private oldCoordinate: Coordinate;

    public constructor(coordinate: Coordinate) {
        super();
        this.coordinate = coordinate;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        this.oldCoordinate = this.game.getBallCoordinate();
    }

    public do() {
        this.game.setBallCoordinate(this.coordinate);
    }

    public undo() {
        this.game.setBallCoordinate(this.oldCoordinate);
    }
}

export class SetActivePlayerId extends AbstractCommand {
    private activePlayerId: string;
    private oldActivePlayerId: string;

    public constructor(playerId: string) {
        super();
        this.activePlayerId = playerId;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);
        let player = game.getActivePlayer();
        if (player != null) {
            this.oldActivePlayerId = game.getActivePlayer().getId();
        } else {
            this.oldActivePlayerId = null;
        }
    }

    public do() {
        this.game.setActivePlayer(this.activePlayerId);
    }

    public undo() {
        this.game.setActivePlayer(this.oldActivePlayerId);
    }
}

export class SetActivePlayerAction extends AbstractCommand {
    private action: string;

    public constructor(action: string) {
        super();
        this.action = action;
    }

    public do() {
        this.controller.triggerEvent(EventType.ActivePlayerAction, this.action);
    }

    public undo() {

    }
}

export class SetScore extends AbstractCommand {
    private team: Model.Team;
    private side: string;
    private score: number;
    private oldScore: number;

    public constructor(side: string, score: number) {
        super();
        this.side = side;
        this.score = score;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);

        if (this.side == "home") {
            this.team = this.game.teamHome;
        } else {
            this.team = this.game.teamAway;
        }

        this.oldScore = this.team.getScore();
    }

    public do() {
        this.team.setScore(this.score);
    }

    public undo() {
        this.team.setScore(this.oldScore);
    }
}

export class SetPlayingSide extends AbstractCommand {
    private side: Model.Side;
    private oldSide: number;

    public constructor(side: Model.Side) {
        super();
        this.side = side;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);

        this.oldSide = this.game.getPlayingSide();
    }

    public do() {
        this.game.setPlayingSide(this.side);
    }

    public undo() {
        this.game.setPlayingSide(this.oldSide);
    }
}

export class SetTurnNr extends AbstractCommand {
    private team: Model.Team;
    private side: string;
    private turn: number;
    private oldTurn: number;

    public constructor(side: string, turn: number) {
        super();
        this.side = side;
        this.turn = turn;
    }

    public init(game: Model.Game, controller: Controller) {
        super.init(game, controller);

        if (this.side == "home") {
            this.team = this.game.teamHome;
        } else {
            this.team = this.game.teamAway;
        }

        this.oldTurn = this.team.getTurn();
    }

    public do() {
        this.team.setTurn(this.turn);
    }

    public undo() {
        this.team.setTurn(this.oldTurn);
    }
}

export class BlockRoll extends AbstractCommand {
    private rolls: number[];

    public constructor(rolls: number[]) {
        super();
        this.rolls = rolls;
    }

    public do() {
        let location = this.getLocation([]);

        let rollKey = this.controller.DiceManager.roll("db", this.rolls, location);
        this.controller.triggerEvent(EventType.BlockDice, rollKey);
    }

    public undo() {

    }
}

export class BlockChoice extends AbstractCommand {
    private choice: number;
    private result: string;

    public constructor(choice: number, result: string) {
        super();
        this.choice = choice;
        this.result = result;
    }

    public do() {
        this.controller.triggerEvent(EventType.BlockChoice, {
            choice: this.choice
        });
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getActivePlayer(),
            text: this.result,
        });
    }

    public undo() {
    }
}

export class GoForItRoll extends AbstractCommand {
    private roll: number;
    private minimumRoll: number;

    public constructor(roll: number, minimumRoll: number) {
        super();
        this.roll = roll;
        this.minimumRoll = minimumRoll;
    }

    public do() {
        let location = this.getLocation([]);

        this.controller.DiceManager.roll("d6", [this.roll], location);
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getActivePlayer(),
            text: "GFI " + this.minimumRoll + "+",
        });
    }

    public undo() {

    }
}

export class Injury extends AbstractCommand {
    private attackerId: string;
    private defenderId: string;
    private armorRoll: [number, number];
    private injuryRoll: [number, number];
    private casualtyRoll: [number, number];
    private casualtyRollDecay: [number, number];
    private injuredPlayerState: Model.PlayerState;

    private location: Coordinate;

    public constructor(attackerId: string, defenderId: string, armorRoll: [number, number], injuryRoll: [number, number], casualtyRoll: [number, number], casualtyRollDecay: [number, number], injuredPlayerState: Model.PlayerState) {
        super();
        this.attackerId = attackerId;
        this.defenderId = defenderId;
        this.armorRoll = armorRoll;
        this.injuryRoll = injuryRoll;
        this.casualtyRoll = casualtyRoll;
        this.casualtyRollDecay = casualtyRollDecay;
        this.injuredPlayerState = injuredPlayerState;
    }

    private rollDice(type: DieType, targets: number[]) {
        this.controller.DiceManager.roll(type, targets, this.location, 1000);
    }

    public do() {
        this.location = this.getLocation([ this.defenderId, this.attackerId]);

        if (this.armorRoll != null) {
            this.rollDice("d6", this.armorRoll);
        }
        if (this.injuryRoll != null) {
            this.rollDice("d6", this.injuryRoll);
        }
        if (this.casualtyRoll != null) {
            this.rollDice("d68", this.casualtyRoll);
        }
        if (this.casualtyRollDecay != null) {
            this.rollDice("d68", this.casualtyRollDecay);
        }

        this.controller.triggerEvent(EventType.FloatText, {
            player: this.game.getPlayer(this.defenderId),
            text: Model.PlayerState[this.injuredPlayerState]
        });
    }

    public undo() {

    }
}

export class DodgeRoll extends AbstractCommand {
    private roll: number;
    private minimumRoll: number;

    public constructor(roll: number, minimumRoll: number) {
        super();
        this.roll = roll;
        this.minimumRoll = minimumRoll;
    }

    public do() {
        let location = this.getLocation([]);

        this.controller.DiceManager.roll("d6", [this.roll], location);
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getActivePlayer(),
            text: "Dodge " + this.minimumRoll + "+",
        })
    }

    public undo() {

    }
}

export class PassRoll extends AbstractCommand {
    private roll: number;
    private minimumRoll: number;
    private playerId: string;

    public constructor(playerId: string, roll: number, minimumRoll: number) {
        super();
        this.roll = roll;
        this.minimumRoll = minimumRoll;
        this.playerId = playerId;
    }

    public do() {
        let location = this.getLocation([]);
        this.controller.DiceManager.roll("d6", [this.roll], location);
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getPlayer(this.playerId),
            text: "Pass " + this.minimumRoll + "+",
        })
    }

    public undo() {

    }
}

export class CatchRoll extends AbstractCommand {
    private roll: number;
    private playerId: string;
    private minimumRoll: number;

    public constructor(playerId: string, roll: number, minimumRoll: number) {
        super();
        this.playerId = playerId;
        this.roll = roll;
        this.minimumRoll = minimumRoll;
    }

    public do() {
        let location = this.getLocation([]);
        this.controller.DiceManager.roll("d6", [this.roll], location);
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getPlayer(this.playerId),
            text: "Catch " + this.minimumRoll + "+",
        })
    }

    public undo() {

    }
}

export class PickupRoll extends AbstractCommand {
    private roll: number;
    private minimumRoll: number;
    private playerId: string;

    public constructor(playerId: string, roll: number, minimumRoll: number) {
        super();
        this.roll = roll;
        this.minimumRoll = minimumRoll;
        this.playerId = playerId;
    }

    public do() {
        let location = this.getLocation([this.playerId]);
        this.controller.DiceManager.roll("d6", [this.roll], location);
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getPlayer(this.playerId),
            text: "Pickup " + this.minimumRoll + "+",
        })
    }

    public undo() {

    }
}