import Position from "./position";

export default class Roster {
    public id: string;
    public name: string;
    public positions:any;

    public constructor(data: FFB.Protocol.Messages.RosterType) {
        this.id = data.rosterId;
        this.name = data.rosterName;

        this.positions = {};
        for (let position of data.positionArray) {
            this.positions[position.positionId] = new Position(position);
        }
    }

    public getAssets() {
        let assets = {
            graphics: [],
            sprites: []

        };

        for (let position in this.positions) {
            let positionAssets = this.positions[position].getAssets();

            for (let sprite in positionAssets['sprites']) {
                assets['sprites'].push(positionAssets['sprites'][sprite]);
            }
        }

        return assets;
    }
}