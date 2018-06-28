
import Game from "./game";
import Player from "./player";
import Coordinate from "../types/coordinate";

export abstract class AbstractCommand {
    protected applied: boolean;
    protected game: Game;
    public triggerModelChanged: boolean;

    public constructor() {
        this.applied = false;
        this.triggerModelChanged = true;
    }

    public apply(game: Game) {
        if (!this.applied) {
            this.game = game;
            this.applied = true;
            this.init();
        }

        this.do();
    }

    public setGame(game: Game) {
        this.game = game;
    }

    public abstract init(): void;
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

    public init() {
        for (let command of this.commandList) {
            command.setGame(this.game);
            command.init();
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

    public init() {
    }

    public do() {
        this.game.initialize(this.data);
    }

    public undo() {
    }
}

abstract class PlayerCommand extends AbstractCommand {
    protected player: Player;
    protected playerId: string;

    public constructor(playerId: string) {
        super();
        this.playerId = playerId;
    }

    public init() {
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

    public init() {
        super.init();
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

    public init() {
        super.init();
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

    public init() {
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

    public init() {
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

    public init() {
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

    public init() {
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

    public init() {
        this.oldCoordinate = this.game.getBallCoordinate();
    }

    public do() {
        this.game.setBallCoordinate(this.coordinate);
    }

    public undo() {
        this.game.setBallCoordinate(this.oldCoordinate);
    }
}