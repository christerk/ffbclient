
declare namespace FFB {
    namespace Protocol {
        namespace Messages {

            type Coordinate = Array<integer>;

            type BloodSpotType = {
                coordinate: Coordinate;
                injury: integer;
            }

            type ModelChangeType = {
                modelChangeId: string;
                modelChangeKey: string;
                modelChangeValue: any;
            }

            type ModelChangeListType = {
                modelChangeArray: ModelChangeType[];
            }

            type PlayerDataType = {
                playerId: string;
                playerCoordinate: Coordinate;
                playerState: integer;
                cardEffects: any[];
                cards: any[];
            }

            type PlayerMarkerType = {
                playerId: string;
                homeText: string;
                awayText: string;
            }

            type TrackNumberType = {
                number: integer;
                coordinate: Coordinate;
            }

            type FieldModelType = {
                ballCoordinate: Coordinate;
                ballInPlay: boolean;
                ballMoving: boolean;
                bloodspotArray: BloodSpotType[];
                bombCoordinate: Coordinate;
                bombMoving: boolean;
                diceDecorationArray: any[];
                fieldMarkerArray: any[];
                moveSquareArray: any[];
                playerDataArray: PlayerDataType[];
                playerMarkerArray: PlayerMarkerType[];
                pushbackSquareArray: any[];
                trackNumberArray: TrackNumberType[];
                weather: string;
            }

            type PlayerType = {
                agility: integer;
                armour: integer;
                lastingInjuries: string[];
                movement: integer;
                nrOfIcons: integer;
                playerGender: string;
                playerId: string;
                playerName: string;
                playerNr: integer;
                playerType: string;
                positionIconIndex: integer;
                positionId: string;
                recoveringInjury: any;
                skillArray: string[];
                strength: integer;
                urlIconSet: string;
                urlPortrait: string;
            }

            type PositionType = {
                agility: integer;
                armour: integer;
                cost: integer;
                displayName: string;
                movement: integer;
                nrOfIcons: integer;
                playerGender: string;
                playerType: string;
                positionId: string;
                positionName: string;
                quantity: integer;
                race: any;
                shorthand: string;
                skillArray: string[];
                skillCategoriesDouble: string[];
                skillCategoriesNormal: string[];
                skillValues: any[];
                strength: integer;
                teamWithPositionId: string;
                thrall: boolean;
                undead: boolean;
                urlIconSet: string;
                urlPortrait: string;
            }

            type RosterType = {
                apothecary: boolean;
                baseIconPath: string;
                logoUrl: string;
                maxReRolls: integer;
                necromancer: boolean;
                positionArray: PositionType[];
                raisedPositionId: string;
                reRollCost: integer;
                rosterId: string;
                rosterName: string;
                undead: boolean;
            }

            type TeamType = {
                apothecaries: integer;
                assistantCoaches: integer;
                baseIconPath: string;
                cheerleaders: integer;
                coach: string;
                fanFactor: integer;
                logoUrl: string;
                playerArray: PlayerType[];
                race: string;
                reRolls: integer;
                roster: RosterType;
                teamId: string;
                teamName: string;
                teamValue: integer;
                treasury: integer;
            }

            type GameType = {
                actingPlayer: any;
                connectionPossible: boolean;
                defenderAction: any;
                defenderId: any;
                fieldModel: FieldModelType;
                finished: boolean;
                gameId: integer;
                gameOptions: any;
                gameResult: any;
                gameTime: integer;
                half: integer;
                homeFirstOffense: boolean;
                homePlaying: boolean;
                lastTurnMode: string;
                passCoordinate: any;
                scheduled: string;
                setupOffense: boolean;
                started: string;
                teamAway: TeamType;
                teamHome: TeamType;
                testing: boolean;
                throwerAction: any;
                throwerId: any;
                timeoutEnforced: boolean;
                timeoutPossible: boolean;
                turnDataAway: any;
                turnDataHome: any;
                turnMode: string;
                turnTime: integer;
                waitingForOpponent: boolean;
            }

            interface NetCommand {
                netCommandId: string;
                [key: string]: any;
            }

            interface ClientCommand extends NetCommand {
                entropy: integer;
            }

            interface ServerCommand extends NetCommand {
                commandNr: integer;
            }

            interface ServerModelSync extends NetCommand {
                commandNr: integer;
                modelChangeList: ModelChangeListType
                reportList: any[];
                animation: any[];
                sound: string;
                gameTime: integer;
                turnTime: integer;
            }

            interface ServerGameTime extends NetCommand {
                gameTime: integer;
                turnTime: integer;
            }

            interface ServerGameState extends NetCommand {
                game: GameType;
            }
        }
    }
}
