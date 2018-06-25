import Coordinate from "../types/coordinate";

export default class Player {
    public number: number;
    public name: string;
    public positionId: string;
    public movement: number;
    public strength: number;
    public agility: number;
    public armour: number;
    public icon: Phaser.GameObjects.Sprite;
    public state: number;
    public coordinate: Coordinate;
    public positionIcon: number;

    public constructor(data: FFB.Protocol.Messages.PlayerType) {
        this.number = data.playerNr;
        this.name = data.playerName;
        this.positionId = data.positionId;
        this.movement = data.movement;
        this.strength = data.strength;
        this.agility = data.agility;
        this.armour = data.armour;
        this.positionIcon = data.positionIconIndex;
    }

    public setState(state: number) {
        this.state = state;
    }

    public getPosition(): Coordinate {
        return this.coordinate;
    }

    public setPosition(coordinate: Coordinate) {
        this.coordinate = coordinate;
    }
}