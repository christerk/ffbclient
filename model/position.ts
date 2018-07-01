
export class Position {
    public id: string;
    public name: string;
    public iconURI: string;

    public constructor(data: FFB.Protocol.Messages.PositionType) {
        this.id = data.positionId;
        this.name = data.positionName;
        this.iconURI = data.urlIconSet;
    }

    public getAssets() {
        let assets = {
            graphics: [],
            sprites: [ this.iconURI ],
        };

        return assets;
    }
}