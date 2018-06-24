import PlayerData from "./playerdata";

export default class FieldModel {
    public playerData;

    public constructor(data: any) {

        this.playerData = {};
        for (let i in data['playerDataArray']) {
            let pData = data['playerDataArray'][i];
            this.playerData[pData['playerId']] = new PlayerData(pData);
        }
    }

    public movePlayer(id: string, x: integer, y: integer) {
        console.log(this.playerData, id);
        this.playerData[id]['coordinate'][0] = x;
        this.playerData[id]['coordinate'][1] = y;
    }
}