import Coordinate from "../types/coordinate";

export default class Player {
    public number: integer;
    public name: string;
    public positionId: string;
    public movement: integer;
    public strength: integer;
    public agility: integer;
    public armour: integer;
    public icon;
    public state: integer;
    public coordinate: Coordinate;

    public constructor(data: any) {
        this.number = data['playerNr'];
        this.name = data['playerName'];
        this.positionId = data['positionId'];
        this.movement = data['movement'];
        this.strength = data['strength'];
        this.agility = data['agility'];
        this.armour = data['armour'];
    }

    public setState(state: integer) {
        this.state = state;
    }

    public setPosition(coordinate: Coordinate) {
        this.coordinate = coordinate;
    }
}