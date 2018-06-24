
export default class PlayerData {
    public coordinate;
    public state;

    public constructor(data: any) {
        this.coordinate = data['playerCoordinate'];
        this.state = data['playerState'];
    }
}