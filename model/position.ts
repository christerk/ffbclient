
export class Position {
    public id: string;
    public name: string;
    public iconURI: string;
    private portrait: string;

    public constructor(data: FFB.Protocol.Messages.PositionType) {
        this.id = data.positionId;
        this.name = data.positionName;
        this.iconURI = data.urlIconSet;
        this.portrait = data.urlPortrait;
    }

    public getAssets() {
        let assets = {
            graphics: [ this.portrait ],
            sprites: [ this.iconURI ],
        };

        return assets;
    }

    public getPortrait() {
        return this.portrait;
    }
}