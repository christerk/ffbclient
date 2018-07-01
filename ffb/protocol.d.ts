declare namespace FFB.Protocol.Messages {
    type Coordinate = Array<number>;

    enum PlayerState {}

    type BloodSpotType = {
        coordinate: Coordinate;
        injury:     PlayerState;
    }

    type ModelChangeType = {
        modelChangeId:      string;
        modelChangeKey:     string;
        modelChangeValue:   any; // FFB Client type = Object (investigate further)
    }

    type ModelChangeListType = {
        modelChangeArray: ModelChangeType[];
    }

    type CardEffect = {
        // DISTRACTED("Distracted"),  ILLEGALLY_SUBSTITUTED("IllegallySubstituted"),  MAD_CAP_MUSHROOM_POTION("MadCapMushroomPotion"),  SEDATIVE("Sedative"),  POISONED("Poisoned");
        name: string;
    }

    type Card = {
       name: string
    }
   
    // REVISIT
    type PlayerDataType = {
        playerId:           string;
        playerCoordinate:   Coordinate;
        playerState:        number;
        cardEffects:        CardEffect[];
        cards:              Card[];
    }

    type PlayerMarkerType = {
        playerId: string;
        homeText: string;
        awayText: string;
    }

    type TrackNumberType = {
        number:     number;
        coordinate: Coordinate;
    }

    type DiceDecoration = {
        fieldCoordinate: Coordinate;
        numDice:         number;
    }

    type FieldMarker = {
        field:      Coordinate;
        homeText:   string;
        awayText:   string;
    }

    type MoveSquare = {
        fieldCoordinate:    Coordinate;
        minimumRollDodge:   number;
        minimumRollGfi:     number;
    }

    type PushbackSquare = {
        fieldCoordinate: Coordinate;
        direction:       string; //NORTH("North"),  NORTHEAST("Northeast"),  EAST("East"),  SOUTHEAST("Southeast"),  SOUTH("South"),  SOUTHWEST("Southwest"),  WEST("West"),  NORTHWEST("Northwest");
        selected:        boolean;
        locked:          boolean;
        homeChoice:      boolean;
    }

    type FieldModelType = {
        ballCoordinate:     Coordinate;
        ballInPlay:         boolean;
        ballMoving:         boolean;
        bloodspotArray:     BloodSpotType[];
        bombCoordinate:     Coordinate;
        bombMoving:         boolean;
        diceDecorationArray:DiceDecoration[];
        fieldMarkerArray:   FieldMarker[];
        moveSquareArray:    MoveSquare[];
        playerDataArray:    PlayerDataType[];
        playerMarkerArray:  PlayerMarkerType[];
        pushbackSquareArray:PushbackSquare[];
        trackNumberArray:   TrackNumberType[];
        weather:            string;
    }

    type SeriousInjury = {
        name: string;
    }

    type Skill = {
        name: string;
    }

    type PlayerType = {
        agility:            number;
        armour:             number;
        lastingInjuries:    SeriousInjury[];
        movement:           number;
        nrOfIcons:          number;
        playerGender:       string;
        playerId:           string;
        playerName:         string;
        playerNr:           number;
        playerType:         string;
        positionIconIndex:  number;
        positionId:         string;
        recoveringInjury:   SeriousInjury;
        skillArray:         string[];
        strength:           number;
        urlIconSet:         string;
        urlPortrait:        string;
    }


    type PositionType = {
        agility:                number;
        armour:                 number;
        cost:                   number;
        displayName:            string;
        movement:               number;
        nrOfIcons:              number;
        playerGender:           string;
        playerType:             string;
        positionId:             string;
        positionName:           string;
        quantity:               number;
        race:                   string;
        shorthand:              string;
        skillArray:             Skill[];
        skillCategoriesDouble:  Skill[];
        skillCategoriesNormal:  Skill[];
        skillValues:            number[];
        strength:               number;
        teamWithPositionId:     string;
        thrall:                 boolean;
        undead:                 boolean;
        urlIconSet:             string;
        urlPortrait:            string;
    }

    type RosterType = {
        apothecary:         boolean;
        baseIconPath:       string;
        logoUrl:            string;
        maxReRolls:         number;
        necromancer:        boolean;
        positionArray:      PositionType[];
        raisedPositionId:   string;
        reRollCost:         number;
        rosterId:           string;
        rosterName:         string;
        undead:             boolean;
    }

    type TeamType = {
        apothecaries:       number;
        assistantCoaches:   number;
        baseIconPath:       string;
        cheerleaders:       number;
        coach:              string;
        fanFactor:          number;
        logoUrl:            string;
        playerArray:        PlayerType[];
        race:               string;
        reRolls:            number;
        roster:             RosterType;
        teamId:             string;
        teamName:           string;
        teamValue:          number;
        treasury:           number;
    }

    type PlayerAction = {
        name: string;
    }

    type ActingPlayer = {
        playerId:           string;
        currentMove:        number;
        goingForIt:         boolean;
        hasBlocked:         boolean;
        hasFed:             boolean;
        hasFouled:          boolean;
        hasMoved:           boolean;
        hasPassed:          boolean;
        standingUp:         boolean;
        sufferingBloodlust: boolean;
        sufferingAnimosity: boolean;
        playerAction:       PlayerAction;
        usedSkillsArray:    Skill[];
    }

    type SendToBoxReason = {
        name: string;
    }

    type PlayerResult = {
        playerId: string;
        completions: number;
        touchdowns: number;
        interceptions: number;
        casualties: number;
        playerAwards: number;
        blocks: number;
        fouls: number;
        rushing: number;
        passing: number;
        currentSpps: number;
        turnsPlayed: number;
        seriousInjury: seriousInjury;
        sendToBoxReason);
        sendToBoxTurn: number;
        sendToBoxHalf: number;
        sendToBoxByPlayerId: string;
        hasUsedSecretWeapon: boolean;
        defecting: boolean;
    }

    type TeamResult = {
        score:                  number;
        conceded:               boolean;
        raisedDead:             boolean;
        spectators:             number
        fame:                   number;
        winnings:               number;
        fanFactorModifier:      number;
        badlyHurtSuffered:      number;
        seriousInjurySuffered:  number;
        ripSuffered:            number;
        spirallingExpenses:     number;
        playerResults:          [string, PlayerResult];
        pettyCashTransferred:   number;
        pettyCashUsed:          number;
        teamValue:              number;
    }

    type GameResult = {
        teamResultHome: TeamResult; 
        teamResultAway: TeamResult; 
    }


    type GameType = {
        actingPlayer:           ActingPlayer;
        connectionPossible:     boolean;
        defenderAction:         PlayerAction;
        defenderId:             string;
        fieldModel:             FieldModelType;
        finished:               boolean;
        gameId:                 number;
        gameOptions:            string;
        gameResult:             GameResult;
        gameTime:               number;
        half:                   number;
        homeFirstOffense:       boolean;
        homePlaying:            boolean;
        lastTurnMode:           string;
        passCoordinate: any;
        scheduled:              string;
        setupOffense:           boolean;
        started:                string;
        teamAway:               TeamType;
        teamHome:               TeamType;
        testing:                boolean;
        throwerAction:          any;
        throwerId:              any;
        timeoutEnforced:        boolean;
        timeoutPossible:        boolean;
        turnDataAway:       any;
        turnDataHome:       any;
        turnMode:               string;
        turnTime:               number;
        waitingForOpponent:     boolean;
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
        commandNr:          number;
        modelChangeList:    ModelChangeListType
        reportList: any[];
        animation: any[];
        sound:              string;
        gameTime:           number;
        turnTime:           number;
    }

    interface ServerGameTime extends NetCommand {
        gameTime: number;
        turnTime: number;
    }

    interface ServerGameState extends NetCommand {
        game: GameType;
    }
}
