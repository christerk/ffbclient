import Coordinate from "./coordinate"
import Bloodspot from "./bloodspot"
import PlayerData from "./playerdata"
import PlayerMarker from "./playermarker"
import TrackNumber from "./tracknumber"

export default class FieldModel {
    ballCoordinate: Coordinate;
    ballInPlay: boolean;
    ballMoving: boolean;
    bloodspotArray: Bloodspot[];
    bombCoordinate: Coordinate;
    bombMoving: boolean;
    diceDecorationArray: any[];
    fieldMarkerArray: any[];
    moveSquareArray: any[];
    playerDataArray: PlayerData[];
    playerMarkerArray: PlayerMarker[];
    pushbackSquareArray: any[];
    trackNumberArray: TrackNumber[];
    weather: string;
}
