import * as Model from ".";
import { Coordinate } from "../types";

export class Game {
    private isInitialized: boolean;
    public teamHome: Model.Team;
    public teamAway: Model.Team;
    private activePlayer: Model.Player;

    private moveSquares: Coordinate[];
    private trackNumbers: Coordinate[];

    private ballCoordinate: Coordinate;

    /**
     * Root internal model class.
     *
     * Maintains the internal state of the application.
     */
    public constructor() {
        this.moveSquares = [];
        this.trackNumbers = [];
        this.isInitialized = false;
    }

    public initialize(data: FFB.Protocol.Messages.ServerGameState) {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.teamHome = new Model.Team(data.game.teamHome);
            this.teamAway = new Model.Team(data.game.teamAway);

            if (data.game.fieldModel.ballCoordinate != null) {
                this.ballCoordinate = Coordinate.FromArray(data.game.fieldModel.ballCoordinate);
            }

            this.applyFieldModel(data.game.fieldModel);
        }
    }

    public setActivePlayer(id: string) {
        if (id == null) {
            this.activePlayer = null;
        } else {
            let player = this.getPlayer(id);
            this.activePlayer = player;
        }
    }

    public getActivePlayer(): Model.Player {
        return this.activePlayer;
    }

    public getAssets() {
        let assets = {
            graphics: [],
            sprites: []

        };
        let homeAssets = this.teamHome.getAssets();
        for (let sprite in homeAssets['sprites']) {
            assets['sprites'].push(homeAssets['sprites'][sprite]);
        }

        let awayAssets = this.teamAway.getAssets();
        for (let sprite in awayAssets['sprites']) {
            assets['sprites'].push(awayAssets['sprites'][sprite]);
        }

        return assets;
    }

    public getPlayers(): Model.Player[] {
        let result = [];
        let players = this.teamHome.getPlayers();
        for (let i in players) {
            result.push(players[i]);
        }
        players = this.teamAway.getPlayers();
        for (let i in players) {
            result.push(players[i]);
        }
        return result;
    }

    public movePlayer(id: string, coordinate: Coordinate) {
        let player = this.getPlayer(id);
        player.setPosition(coordinate);
    }

    public getPlayer(id: string): Model.Player {
        let player = this.teamHome.getPlayer(id);

        if (!player) {
            player = this.teamAway.getPlayer(id);
        }

        return player;
    }

    private applyFieldModel(data: FFB.Protocol.Messages.FieldModelType) {
        for (let pData of data.playerDataArray) {
            let player = this.getPlayer(pData.playerId);
            player.setState(pData.playerState);
            let [x,y] = pData.playerCoordinate;
            player.setPosition(new Coordinate(x, y));
        }
    }

    public hasMoveSquare(coordinate: Coordinate): boolean {
        for(let c of this.moveSquares) {
            if (c[0] == coordinate[0] && c[1] == coordinate[1]) {
                return true;
            }
        }
        return false;
    }

    public addMoveSquare(coordinate: Coordinate) {
        for (let c of this.moveSquares) {
            if (c[0] == coordinate[0] && c[1] == coordinate[1]) {
                return;
            }
        }

        this.moveSquares.push(coordinate);
    }

    public removeMoveSquare(coordinate: Coordinate) {
        let result: Coordinate[] = [];
        for (let c of this.moveSquares) {
            if (c[0] != coordinate[0] || c[1] != coordinate[1]) {
                result.push(c);
            }
        }
        this.moveSquares = result;
    }

    public getMoveSquares(): Coordinate[] {
        return this.moveSquares;
    }

    public hasTrackNumber(coordinate: Coordinate): boolean {
        for(let c of this.trackNumbers) {
            if (c[0] == coordinate[0] && c[1] == coordinate[1]) {
                return true;
            }
        }
        return false;
    }

    public addTrackNumber(coordinate: Coordinate) {
        for (let c of this.trackNumbers) {
            if (c[0] == coordinate[0] && c[1] == coordinate[1]) {
                return;
            }
        }

        this.trackNumbers.push(coordinate);
    }

    public removeTrackNumber(coordinate: Coordinate) {
        let result: Coordinate[] = [];
        for (let c of this.trackNumbers) {
            if (c[0] != coordinate[0] || c[1] != coordinate[1]) {
                result.push(c);
            }
        }
        this.trackNumbers = result;
    }

    public getTrackNumbers(): Coordinate[] {
        return this.trackNumbers;
    }

    public getBallCoordinate(): Coordinate {
        return this.ballCoordinate;
    }

    public setBallCoordinate(coordinate: Coordinate): void {
        this.ballCoordinate = coordinate;
    }
}