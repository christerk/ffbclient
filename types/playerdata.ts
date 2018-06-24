import Coordinate from "./coordinate"

export default class PlayerData {
    playerId: string;
    playerCoordinate: Coordinate;
    playerState: integer;
    cardEffects: any[];
    cards: any[];
}
