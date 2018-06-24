import Team from "./team";
import Coordinate from "../types/coordinate";
import Player from "./player";

export default class Game {
    public teamHome: Team;
    public teamAway: Team;
    public dirty;

    /**
     * Root internal model class.
     *
     * Maintains the internal state of the application.
     */
    public constructor() {
        this.dirty = false;
    }

    public initialize(data: FFB.Protocol.Messages.ServerGameState) {
        this.teamHome = new Team(data.game.teamHome);
        this.teamAway = new Team(data.game.teamAway);

        this.applyFieldModel(data.game.fieldModel);
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

    public getPlayers(): Player[] {
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
        this.dirty = true;
    }

    public getPlayer(id: string): Player {
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
}