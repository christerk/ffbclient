
export default class Player {
    public number: integer;
    public name: string;
    public position: string;
    public movement: integer;
    public strength: integer;
    public agility: integer;
    public armour: integer;
    public icon;

    public constructor(data: any) {
        this.number = data['playerNr'];
        this.name = data['playerName'];
        this.position = data['positionId'];
        this.movement = data['movement'];
        this.strength = data['strength'];
        this.agility = data['agility'];
        this.armour = data['armour'];
    }
}