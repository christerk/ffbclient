
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
        this.game.initialize(this.data);
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
    private newState: number;
    private oldState: number;

    public constructor(playerId: string, newState: number) {
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

export class BlockRoll extends AbstractCommand {
    private rolls: number[];

    public constructor(rolls: number[]) {
        super();
        this.rolls = rolls;
    }

    public do() {
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let player = this.controller.Game.getActivePlayer();
        let coordinate = this.controller.Game.findEmptyPatchNearPlayer(player, 2, 2);
        let [x, y] = this.controller.convertToPixels(coordinate.add(1,1));

        let r = this.rolls;

        let sprites = this.controller.DiceManager.roll("db", r, x, y);
        this.controller.triggerEvent(EventType.BlockDice, {
            sprites: sprites
        });
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
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let player = this.controller.Game.getActivePlayer();
        let coordinate = this.controller.Game.findEmptyPatchNearPlayer(player, 2, 2);
        let [x, y] = this.controller.convertToPixels(coordinate.add(1,1));

        this.controller.DiceManager.roll("d6", [this.roll], x, y);
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getActivePlayer(),
            text: "GFI " + this.minimumRoll + "+",
        });
    }

    public undo() {

    }
}

export class Injury extends AbstractCommand {
    private armorRoll: [number, number];
    private injuryRoll: [number, number];
    private casualtyRoll: [number, number];
    private casualtyRollDecay: [number, number];

    private blockedSquares: Coordinate[];

    public constructor(armorRoll: [number, number], injuryRoll: [number, number], casualtyRoll: [number, number], casualtyRollDecay: [number, number]) {
        super();
        this.armorRoll = armorRoll;
        this.injuryRoll = injuryRoll;
        this.casualtyRoll = casualtyRoll;
        this.casualtyRollDecay = casualtyRollDecay;
    }

    private rollDice(type: DieType, targets: number[], delay: number) {
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let player = this.controller.Game.getActivePlayer();
        let coordinate = this.controller.Game.findEmptyPatchNearPlayer(player, 2, 2, this.blockedSquares);

        let x = coordinate.x;
        let y = coordinate.y;

        this.blockedSquares.push(coordinate);
        this.blockedSquares.push(coordinate.add(1,0));
        this.blockedSquares.push(coordinate.add(0,1));
        this.blockedSquares.push(coordinate.add(1,1));

        [x, y] = this.controller.convertToPixels(coordinate.add(1,1));

        this.controller.DiceManager.roll(type, targets, x, y, 1000, delay);
    }

    public do() {
        this.blockedSquares= [];
        if (this.armorRoll != null) {
            this.rollDice("d6", this.armorRoll, 0);
        }
        if (this.injuryRoll != null) {
            this.rollDice("d6", this.injuryRoll, 333);
        }
        if (this.casualtyRoll != null) {
            this.rollDice("d68", this.casualtyRoll, 666);
        }
        if (this.casualtyRollDecay != null) {
            this.rollDice("d68", this.casualtyRollDecay, 999);
        }
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
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let player = this.controller.Game.getActivePlayer();
        let coordinate = this.controller.Game.findEmptyPatchNearPlayer(player, 2, 2);
        let [x, y] = this.controller.convertToPixels(coordinate.add(1,1));

        this.controller.DiceManager.roll("d6", [this.roll], x, y);
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

    public constructor(roll: number, minimumRoll: number) {
        super();
        this.roll = roll;
        this.minimumRoll = minimumRoll;
    }

    public do() {
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let player = this.controller.Game.getActivePlayer();
        let coordinate = this.controller.Game.findEmptyPatchNearPlayer(player, 2, 2);
        let [x, y] = this.controller.convertToPixels(coordinate.add(1,1));

        this.controller.DiceManager.roll("d6", [this.roll], x, y);
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getActivePlayer(),
            text: "Pass " + this.minimumRoll + "+",
        })
    }

    public undo() {

    }
}

export class PickupRoll extends AbstractCommand {
    private roll: number;
    private minimumRoll: number;

    public constructor(roll: number, minimumRoll: number) {
        super();
        this.roll = roll;
        this.minimumRoll = minimumRoll;
    }

    public do() {
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let player = this.controller.Game.getActivePlayer();
        let coordinate = this.controller.Game.findEmptyPatchNearPlayer(player, 2, 2);
        let [x, y] = this.controller.convertToPixels(coordinate.add(1,1));

        this.controller.DiceManager.roll("d6", [this.roll], x, y);
        this.controller.triggerEvent(EventType.FloatText, {
            player: this.controller.Game.getActivePlayer(),
            text: "Pickup " + this.minimumRoll + "+",
        })
    }

    public undo() {

    }
}