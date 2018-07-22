import * as Model from ".";

export class Team {
    private game: Model.Game;
    private coach: string;
    private name: string;
    private roster: Model.Roster;
    private players: { [key: string]: Model.Player };
    private matchStats;

    private score: number;
    private turn: number;

    public constructor(game: Model.Game, data: FFB.Protocol.Messages.TeamType) {
        this.game = game;
        this.name = data.teamName;
        this.roster = new Model.Roster(data.roster);

        this.players = {};
        for (let player of data.playerArray) {
            this.players[player['playerId']] = new Model.Player(this, player);
        }
        this.score = 0;
        this.turn = 0;
        this.coach = data.coach;
    }

    public get Game(): Model.Game {
        return this.game;
    }

    public getName() {
        return this.name;
    }

    public getCoach() {
        return this.coach;
    }

    public getRoster() {
        return this.roster;
    }

    public setScore(score: number) {
        this.score = score;
    }

    public getScore(): number {
        return this.score;
    }

    public setTurn(turn: number) {
        this.turn = turn;        
    }

    public getTurn(): number {
        return this.turn;
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
        for (let image in rosterAssets['graphics']) {
            assets['graphics'].push(rosterAssets['graphics'][image]);
        }

        for (let playerId in this.players) {
            let player = this.players[playerId];
            let playerAssets = player.getAssets();

            for (let sprite in playerAssets['sprites']) {
                assets['sprites'].push(playerAssets['sprites'][sprite]);
            }
            for (let image in playerAssets['graphics']) {
                assets['graphics'].push(playerAssets['graphics'][image]);
            }
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