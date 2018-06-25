
declare namespace FFB.Protocol.Messages {
    type Coordinate = Array<number>;

    type BloodSpotType = {
        coordinate: Coordinate;
        injury: number;
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
        playerState: number;
        cardEffects: any[];
        cards: any[];
    }

    type PlayerMarkerType = {
        playerId: string;
        homeText: string;
        awayText: string;
    }

    type TrackNumberType = {
        number: number;
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
        agility: number;
        armour: number;
        lastingInjuries: string[];
        movement: number;
        nrOfIcons: number;
        playerGender: string;
        playerId: string;
        playerName: string;
        playerNr: number;
        playerType: string;
        positionIconIndex: number;
        positionId: string;
        recoveringInjury: any;
        skillArray: string[];
        strength: number;
        urlIconSet: string;
        urlPortrait: string;
    }

    type PositionType = {
        agility: number;
        armour: number;
        cost: number;
        displayName: string;
        movement: number;
        nrOfIcons: number;
        playerGender: string;
        playerType: string;
        positionId: string;
        positionName: string;
        quantity: number;
        race: any;
        shorthand: string;
        skillArray: string[];
        skillCategoriesDouble: string[];
        skillCategoriesNormal: string[];
        skillValues: any[];
        strength: number;
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
        maxReRolls: number;
        necromancer: boolean;
        positionArray: PositionType[];
        raisedPositionId: string;
        reRollCost: number;
        rosterId: string;
        rosterName: string;
        undead: boolean;
    }

    type TeamType = {
        apothecaries: number;
        assistantCoaches: number;
        baseIconPath: string;
        cheerleaders: number;
        coach: string;
        fanFactor: number;
        logoUrl: string;
        playerArray: PlayerType[];
        race: string;
        reRolls: number;
        roster: RosterType;
        teamId: string;
        teamName: string;
        teamValue: number;
        treasury: number;
    }

    type GameType = {
        actingPlayer: any;
        connectionPossible: boolean;
        defenderAction: any;
        defenderId: any;
        fieldModel: FieldModelType;
        finished: boolean;
        gameId: number;
        gameOptions: any;
        gameResult: any;
        gameTime: number;
        half: number;
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
        turnTime: number;
        waitingForOpponent: boolean;
    }

    interface NetCommand {
        netCommandId: string;
        [key: string]: any;
    }

    interface ClientCommand extends NetCommand {
        entropy: number;
    }

    interface ServerCommand extends NetCommand {
        commandNr: number;
    }

    interface ServerModelSync extends NetCommand {
        commandNr: number;
        modelChangeList: ModelChangeListType
        reportList: any[];
        animation: any[];
        sound: string;
        gameTime: number;
        turnTime: number;
    }

    interface ServerGameTime extends NetCommand {
        gameTime: number;
        turnTime: number;
    }

    interface ServerGameState extends NetCommand {
        game: GameType;
    }
}
