import Team from "./team";
import FieldModel from "./fieldmodel";

export default class Game {
    public teamHome: Team;
    public teamAway: Team;
    public fieldModel: FieldModel;
    public dirty;

    public constructor(data: any) {
        this.teamHome = new Team(data['game']['teamHome']);
        this.teamAway = new Team(data['game']['teamAway']);
        this.fieldModel = new FieldModel(data['game']['fieldModel']);
        this.dirty = false;
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

    public movePlayer(id: string, x: integer, y: integer) {
        this.fieldModel.movePlayer(id, x, y);
        this.dirty = true;
    }

    public getPlayer(id: string) {
        let player = this.teamHome.getPlayer(id);

        if (!player) {
            player = this.teamAway.getPlayer(id);
        }

        return player;
    }
}