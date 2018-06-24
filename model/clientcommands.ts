
import Game from "./game";
import Player from "./player";
import Coordinate from "../types/coordinate";

export abstract class AbstractCommand {
    protected applied: boolean;

    public constructor() {
        this.applied = false;
    }

    public apply(game: Game) {
        if (!this.applied) {
            this.applied = true;
            this.init(game);
        }

        this.do(game);
    }

    public abstract init(game: Game): void;
    public abstract do(game: Game): void;
    public abstract undo(game: Game): void;
}

export class Initialize extends AbstractCommand {
    private data;

    public constructor(data: FFB.Protocol.Messages.ServerGameState) {
        super();
        this.data = data;
    }

    public init(game: Game) {
    }

    public do(game: Game) {
        game.initialize(this.data);
    }

    public undo(game: Game) {
    }
}

abstract class PlayerCommand extends AbstractCommand {
    protected player: Player;
    protected playerId: string;

    public constructor(playerId: string) {
        super();
        this.playerId = playerId;
    }

    public init(game: Game) {
        this.player = game.getPlayer(this.playerId);
    }

    public abstract do(game: Game): void;
    public abstract undo(game: Game): void;

}

export class MovePlayer extends PlayerCommand {
    private oldCoordinate: Coordinate;
    private newCoordinate: Coordinate;

    public constructor(playerId:string, coordinate: Coordinate) {
        super(playerId);
        this.newCoordinate = coordinate;
    }

    public init(game: Game) {
        super.init(game);
        this.oldCoordinate = this.player.getPosition();
    }

    public do(game: Game) {
        this.player.setPosition(this.newCoordinate);
    }

    public undo(game: Game) {
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

    public init(game: Game) {
        super.init(game);
        this.oldState = this.player.state;
    }

    public do(game: Game) {
        this.player.setState(this.newState);
    }

    public undo(game: Game) {
        this.player.setState(this.oldState);
    }
}