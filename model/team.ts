import * as Model from ".";

export class Team {
    public name: string;
    public roster: Model.Roster;
    public players: { [key: string]: Model.Player };
    public matchStats;

    public constructor(data: FFB.Protocol.Messages.TeamType) {
        this.name = data.teamName;
        this.roster = new Model.Roster(data.roster);

        this.players = {};
        for (let player of data.playerArray) {
            this.players[player['playerId']] = new Model.Player(player);
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

    public getPlayers(): {[key: string]: Model.Player} {
        return this.players;
    }

    public getPlayer(id: string) {
        return this.players[id];
    }
}