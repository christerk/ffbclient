import Roster from "./roster";
import Player from "./player";

export default class Team {
    public roster: Roster;
    public players: { [key: string]: Player };

    public constructor(data: any) {
        this.roster = new Roster(data['roster']);

        this.players = {};
        for (let player of data['playerArray']) {
            this.players[player['playerId']] = new Player(player);
        }
    }

    public getAssets() {
        let assets = {
            graphics: [],
            sprites: []

        };

        let rosterAssets = this.roster.getAssets();
        for (let sprite in rosterAssets['sprites']) {
            assets['sprites'].push(rosterAssets['sprites'][sprite]);
        }

        return assets;
    }

    public getPlayers(): {[key: string]: Player} {
        return this.players;
    }

    public getPlayer(id: string) {
        return this.players[id];
    }
}