
import * as Model from ".";
import { Coordinate } from "../types";
import Controller from "../controller";

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

export class BlockRoll extends AbstractCommand {
    private rolls: number[];

    public constructor(rolls: number[]) {
        super();
        this.rolls = rolls;
    }

    public do() {
        console.log("In call", this.controller);
        console.log("BlockRoll do()", this);
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let x = Math.random() * w / 2 + w/4;
        let y = Math.random() * h / 2 + h/4;

        let r = this.rolls;
        if (r.length == 1) {
            this.controller.DiceManager.rolldb(r[0], x, y);
        } else if (r.length == 2) {
            this.controller.DiceManager.roll2db(r[0], r[1], x, y);
        } else if (r.length == 3) {
            this.controller.DiceManager.roll3db(r[0], r[1], r[2], x, y);
        }
    }

    public undo() {

    }
}

export class GoForItRoll extends AbstractCommand {
    private roll: number;

    public constructor(roll: number) {
        super();
        this.roll = roll;
    }

    public do() {
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let x = Math.random() * w / 2 + w/4;
        let y = Math.random() * h / 2 + h/4;

        this.controller.DiceManager.rolld6(this.roll, x, y);
    }

    public undo() {

    }
}

export class Injury extends AbstractCommand {
    private armorRoll: [number, number];
    private injuryRoll: [number, number];
    private casualtyRoll: [number, number];
    private casualtyRollDecay: [number, number];

    public constructor(armorRoll: [number, number], injuryRoll: [number, number], casualtyRoll: [number, number], casualtyRollDecay: [number, number]) {
        super();
        this.armorRoll = armorRoll;
        this.injuryRoll = injuryRoll;
        this.casualtyRoll = casualtyRoll;
        this.casualtyRollDecay = casualtyRollDecay;
    }

    private rollDice(t1: number, t2: number, delay: number) {
        let w = this.controller.scene.sys.canvas.clientWidth;
        let h = this.controller.scene.sys.canvas.clientHeight;

        let x = Math.random() * w / 2 + w/4;
        let y = Math.random() * h / 2 + h/4;

        this.controller.DiceManager.roll2d6(t1, t2, x, y, 1000, delay);
    }

    public do() {
        if (this.armorRoll != null) {
            this.rollDice(this.armorRoll[0], this.armorRoll[1], 0);
        }
        if (this.injuryRoll != null) {
            this.rollDice(this.injuryRoll[0], this.injuryRoll[1], 333);
        }
        if (this.casualtyRoll != null) {
            this.rollDice(this.casualtyRoll[0], this.casualtyRoll[1], 666);
        }
        if (this.casualtyRollDecay != null) {
            this.rollDice(this.casualtyRollDecay[0], this.casualtyRollDecay[1], 999);
        }
    }

    public undo() {

    }
}