import { Coordinate } from "../types";

export enum PlayerState {
   Unknown          = 0x0000,
   Standing         = 0x0001,
   Moving           = 0x0002,
   Prone            = 0x0003,
   Stunned          = 0x0004,
   Knocked_out      = 0x0005,
   Badly_hurt       = 0x0006,
   Serious_injury   = 0x0007,
   Rip              = 0x0008,
   Reserve          = 0x0009,
   Missing          = 0x000a,
   Falling          = 0x000b,
   Blocked          = 0x000c,
   Banned           = 0x000d,
   Exhausted        = 0x000e,
   Being_dragged    = 0x000f,
   Picked_up        = 0x0010,
   Hit_by_fireball  = 0x0011,
   Hit_by_lightning = 0x0012,
   Hit_by_bomb      = 0x0013,
   _bit_active      = 0x0100,
   _bit_confused    = 0x0200,
   _bit_rooted      = 0x0400,
   _bit_hypnotized  = 0x0800,
   _bit_bloodlust   = 0x1000,
   _bit_used_pro    = 0x2000,
}

export enum Side {
    Home,
    Away
}

export class Player {
    public number: number;
    public name: string;
    public positionId: string;
    public movement: number;
    public strength: number;
    public agility: number;
    public armour: number;
    public icon: Phaser.GameObjects.Sprite;
    public state: PlayerState;
    private flags: PlayerState;
    public coordinate: Coordinate;
    public positionIcon: number;
    private side: Side;

    public constructor(data: FFB.Protocol.Messages.PlayerType) {
        this.number = data.playerNr;
        this.name = data.playerName;
        this.positionId = data.positionId;
        this.movement = data.movement;
        this.strength = data.strength;
        this.agility = data.agility;
        this.armour = data.armour;
        this.positionIcon = data.positionIconIndex;

        this.state = PlayerState.Unknown;
    }

    public getTeam(): Side {
        return this.side;
    }

    public setTeam(side: Side) {
        this.side = side;
    }

    public getBaseIconFrame(): number {
        return 4 * this.positionIcon + (this.side == Side.Away ? 2 : 0);
    }

    public getState(): PlayerState {
        return this.state;
    }

    public setState(state: PlayerState) {
        console.log('Setting Player State', state);

        this.state = state & 0xff;
        this.flags = state & ~0xff;
    }

    public getPosition(): Coordinate {
        return this.coordinate;
    }

    public setPosition(coordinate: Coordinate) {
        this.coordinate = coordinate;
    }

    public isActive(): boolean {
        return (this.flags & PlayerState._bit_active) > 0;
    }
}