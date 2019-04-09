declare namespace FFB.Protocol.Messages {
    type Coordinate = Array<number>;

    type PlayerState = number;

    type BloodSpotType = {
        coordinate: Coordinate;
        injury:     PlayerState;
    }

    type ModelChangeType = {
        modelChangeId:      string;
        modelChangeKey:     string;
        modelChangeValue:   null | boolean | string | number | PlayerAction | Skill | Date | TurnMode |
                            Coordinate | PlayerState | SeriousInjury | SendToBoxReason | BloodSpotType |
                            TrackNumberType | PushbackSquare | MoveSquare | Weather | DiceDecoration |
                            Inducement | FieldMarker | PlayerMarkerType | GameOption | Card | LeaderState |
                            CardEffect | DialogId | DialogParameter | RangeRuler;
    }

    type ModelChangeListType = {
        modelChangeArray: ModelChangeType[];
    }
    
    type DialogId = {
        name: string;
    }

    type RangeRuler = {
        throwerId:          string;
        targetCoordinate:   Coordinate;
        minimumRoll:        number;
        throwTeamMate:      boolean;

    }

    type CardEffect = {
        name: string;
    }

    type Card = {
       name: string
    }
   
    type PlayerDataType = {
        playerId:           string;
        playerCoordinate:   Coordinate;
        playerState:        PlayerState;
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
        coordinate:    Coordinate;
        minimumRollDodge:   number;
        minimumRollGfi:     number;
    }

    type PushbackSquare = {
        fieldCoordinate: Coordinate;
        direction:       string;
        selected:        boolean;
        locked:          boolean;
        homeChoice:      boolean;
    }

    type Weather = {
        name: string;
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
        weather:            Weather;
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
        playerId:               string;
        completions:            number;
        touchdowns:             number;
        interceptions:          number;
        casualties:             number;
        playerAwards:           number;
        blocks:                 number;
        fouls:                  number;
        rushing:                number;
        passing:                number;
        currentSpps:            number;
        turnsPlayed:            number;
        seriousInjury:          SeriousInjury;
        sendToBoxReason:        SendToBoxReason;
        sendToBoxTurn:          number;
        sendToBoxHalf:          number;
        sendToBoxByPlayerId:    string;
        hasUsedSecretWeapon:    boolean;
        defecting:              boolean;
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
        playerResults:          PlayerResult[];
        pettyCashTransferred:   number;
        pettyCashUsed:          number;
        teamValue:              number;
    }

    type GameResult = {
        teamResultHome: TeamResult; 
        teamResultAway: TeamResult; 
    }

    type LeaderState = {
        name: string;
    }

    type Inducement = {
        type:   string;
        value:  number;
        uses:   number;
    }

    type InducementSet = {
        inducements:            Inducement[];
        cardsAvailable:         Card[];
        cardsActive:            Card[];
        cardsDeactivated:       Card[];
        starPlayerPositionIds:  string[];
    }

    type TurnData = {
        homeData:               boolean;
        turnStarted:            boolean;
        turnNr:                 number;
        firstTurnAfterKickoff:  boolean;
        reRolls:                number;
        apothecaries:           number;
        blitzUsed:              boolean;
        foulUsed:               boolean;
        reRollUsed:             boolean;
        handOverUsed:           boolean;
        passUsed:               boolean;
        coachBanned:            boolean;
        leaderState:            LeaderState;
        inducementSet:          InducementSet;
    }

    type TurnMode = {
        name: string;
    }

    type GameOption = {
        name: string
    }

    type GameType = {
        actingPlayer:           ActingPlayer;
        connectionPossible:     boolean;
        defenderAction:         PlayerAction;
        defenderId:             string;
        fieldModel:             FieldModelType;
        finished:               boolean;
        gameId:                 number;
        gameOptions:            GameOption[];
        gameResult:             GameResult;
        gameTime:               number;
        half:                   number;
        homeFirstOffense:       boolean;
        homePlaying:            boolean;
        lastTurnMode:           TurnMode;
        passCoordinate:         Coordinate;
        scheduled:              string;
        setupOffense:           boolean;
        started:                string;
        teamAway:               TeamType;
        teamHome:               TeamType;
        testing:                boolean;
        throwerAction:          PlayerAction;
        throwerId:              string;
        timeoutEnforced:        boolean;
        timeoutPossible:        boolean;
        turnDataAway:           TurnData;
        turnDataHome:           TurnData;
        turnMode:               TurnMode;
        turnTime:               number;
        waitingForOpponent:     boolean;
        dialogParameter:        any;
    }

    type ReportId = {
        name: string;
    }

    type BlockReport = {
        reportId: "block";
        defenderId: string;
    }

    type BlockRollReport = {
        reportId: "blockRoll";
        blockRoll: number[];
        choosingTeamId: string;
    }

    type GoForItReport = {
        reportId: "goForItRoll";
        minimumRoll: number;
        rerolled: boolean;
        roll: number;
        successful: boolean;
    }

    type InjuryReport = {
        reportId: "injury";
        armorBroken: boolean;
        armorModifiers: string[];
        armorRoll: [number, number];
        attackerId: string;
        casualtyRoll: [number, number];
        casualtyRollDecay: [number, number];
        defenderId: string;
        injury: number;
        injuryDecay: number;
        injuryModifiers: string[];
        injuryRoll: [number, number];
        injuryType: string;
        seriousInjury: string;
        seriousInjuryDecay: string;
    }

    type DodgeRollReport = {
        reportId: "dodgeRoll";
        minimumRoll: number;
        playerId: string;
        reRolled: boolean;
        roll: number;
        successful: boolean;
    }

    type PassRollReport = {
        reportId: "passRoll";
        bomb: boolean;
        fumble: boolean;
        hailMaryPass: boolean;
        minimumRoll: number;
        passingDistance: string;
        playerId: string;
        reRolled: boolean;
        roll: number;
        safeThrowHold: boolean;
        successful: boolean;
    }

    type PickupRollReport = {
        reportId: "pickupRoll";
        minimumRoll: number;
        playerId: string;
        reRolled: boolean;
        roll: number;
        successful: boolean;
    }

    type CatchRollReport = {
        reportId: "catchRoll";
        bomb: boolean;
        minimumRoll: number;
        playerId: string;
        reRolled: boolean;
        roll: number;
        rollModifiers: string[];
        successful: boolean;
    }

    type BlockChoiceReport = {
        reportId: "blockChoice";
        blockResult: string;
        blockRoll: number[];
        defenderId: string;
        diceIndex: number;
        nrOfDice: number;
    }

    type KickoffResultReport = {
        reportId: "kickoffResult";
        kickoffResult: string;
        kickoffRoll: number[];
    }

    type Report =
        BlockReport | BlockRollReport | GoForItReport | InjuryReport |
        DodgeRollReport | PassRollReport | PickupRollReport | BlockChoiceReport |
        CatchRollReport | KickoffResultReport;

    type ReportList = {
        reports: Report[];
        sound: string;
        turnTime: number;
    }

    type AnimationType = string;

    type Animation = {
        thrownPlayerId:         string;
        withBall:               boolean;
        startCoordinate:        Coordinate;
        endCoordinate:          Coordinate;
        interceptorCoordinate:  Coordinate
        animationType:          AnimationType;
        card:                   Card;
    }

    type KickOffResult = {
        name: string;
    }

    type RerolledAction = {
        name: string;
    }

    type SkillUse = {
        name: string;
    }

    type PlayerChoiceMode = {
        name: string;
    }

    type DialogApothecaryChoiceParameter = {
        dialogId:           DialogId;
        playerId:           string;
        playerStateOld:     PlayerState;
        playerStateNew:     PlayerState;
        seriousInjuryOld:   SeriousInjury;
        seriousInjuryNew:   SeriousInjury;
       }

    type DialogReceiveChoiceParameter = {
        dialogId:   DialogId;
        teamId:     string;
    }

    type DialogReRollParameter = {
        dialogId:           DialogId;
        playerId:           string;
        minimumRoll:        number;
        fumble:             boolean;
        rerolledAction:     RerolledAction;
        teamRerollOption:   boolean;
        proRerollOption:    boolean;
    }

    type DialogSkillUseParameter = {
        dialogId:           DialogId;
        playerId:           string;
        minimumRoll:        number;
        skill:              SkillUse;
    }

    type DialogUseApothecaryParameter = {
        dialogId:       DialogId;
        playerId:       string;
        playerState:    PlayerState;
        seriousInjury:  SeriousInjury;
    }

    type DialogBlockRollParameter = {
        dialogId:           DialogId;
        teamId:             string;
        teamRerollOption:   boolean;
        proRerollOption:    boolean;
        nrOfDice:           number;
        blockRoll:          number[];
    }

    type DialogPlayerChoiceParameter = {
        dialogId:           DialogId;
        teamId:             string;
        playerIds:          string[];
        playerChoiceMode:   PlayerChoiceMode;
        maxSelects:         number;
        descriptions:       string[];
    }

    type DialogInterceptionParameter = {
        dialogId:   DialogId;
        throwerId:  string;
    }

    type DialogWinningsReRollParameter = {
        dialogId:   DialogId;
        teamId:     string;
        oldRoll:    number
    }

    type DialogBribesParameter = {
        dialogId:       DialogId;
        teamId:         string;
        maxNrOfBribes:  number;
        playerIds:      string[];
      }

    type DialogGameStatisticsParameter = {
        dialogId: DialogId;
     }

    type DialogJoinParameter = {
        dialogId: DialogId;
    }

    type DialogStartGameParameter = {
        dialogId: DialogId;
     }

    type DialogTeamSetupParameter = {
        dialogId:       DialogId;
        loadDialog:     boolean;
        setupErrors:    string[];
    }

    type DialogSetupErrorParameter = {
        dialogId:       DialogId;
        teamId:         string;
        setupErrors:    string[];
    }

    type DialogTouchbackParameter = {
        dialogId: DialogId;
     }

    type DialogDefenderActionParameter = {
        dialogId: DialogId;
      }

    type DialogCoinChoiceParameter = {
        dialogId: DialogId;
     }

    type DialogFollowupChoiceParameter = {
        dialogId: DialogId;
     }

    type DialogConcedeGameParameter = {
        dialogId: DialogId;
     }

    type DialogPilingOnParameter = {
        dialogId:           DialogId;
        playerId:           string;
        usesATeamReroll:    boolean;
        rerollInjury:       boolean;
    }

    type DialogBuyInducementsParameter = {
        dialogId:           DialogId;
        teamId:             string;
        wizardAvailable:    boolean;
        availableGold:      number;
    }

    type DialogTransferPettyCashParameter = {
        dialogId: DialogId;
     }

    type DialogJourneymenParameter = {
        dialogId:       DialogId;
        teamId:         string;
        nrOfSlots:      number;
        positionIds:    string[];
    }

    type DialogKickoffResultParameter = {
        dialogId:       DialogId;
        kickOffResult:  KickOffResult;
    }

    type DialogKickSkillParameter = {
        dialogId: DialogId;
        playerId: string;
     }

    type DialogUseIgorParameter = {
        dialogId: DialogId;
        playerId: string;
     }

    type DialogKickoffReturnParameter = {
        dialogId:       DialogId;
        kickOffResult:  KickOffResult;
    }

    type DialogPettyCashParameter = {
        dialogId:           DialogId;
        teamId:             string;
        teamValue:          number;
        treasury:           number;
        opponentTeamValue:  number;
    }

    type DialogWizardSpellParameter = {
        dialogId: DialogId;
     }

    type DialogUseInducementParameter = {
        dialogId:   DialogId;
        teamId:     string;
        cards:      Card[];
    }

    type DialogPassBlockParameter = {
        dialogId: DialogId;
     }

    type DialogBuyCardsParameter = {
        dialogId:           DialogId;
        teamId:             string;
        availableCards:     number;
        availableGold:      number;
        nrOfCardsPerType:   [Card, number];
    }


          

    type DialogArgueTheCallParameter = {
        dialogId:   DialogId;
        teamId:     string;
        playerIds: string[];
     }


    type DialogParameter = {
        id:     DialogId;
        value:  DialogApothecaryChoiceParameter| DialogReceiveChoiceParameter| DialogReRollParameter| DialogSkillUseParameter| DialogUseApothecaryParameter|
                DialogBlockRollParameter| DialogPlayerChoiceParameter| DialogInterceptionParameter| DialogWinningsReRollParameter|
                DialogBribesParameter| DialogGameStatisticsParameter| DialogJoinParameter| DialogStartGameParameter|
                DialogTeamSetupParameter| DialogSetupErrorParameter| DialogTouchbackParameter| DialogDefenderActionParameter|
                DialogCoinChoiceParameter| DialogFollowupChoiceParameter| DialogConcedeGameParameter| DialogPilingOnParameter|
                DialogBuyInducementsParameter| DialogTransferPettyCashParameter| DialogJourneymenParameter| DialogKickoffResultParameter|
                DialogKickSkillParameter| DialogUseIgorParameter| DialogKickoffReturnParameter| DialogPettyCashParameter|
                DialogWizardSpellParameter|  DialogUseInducementParameter| DialogPassBlockParameter| DialogBuyCardsParameter| DialogArgueTheCallParameter
    }


    interface NetCommand {
        netCommandId:   string;
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
        reportList:         ReportList;
        animation:          Animation[];
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

    interface ServerTalk extends NetCommand {
        coach: string;
        talks: string[];
    }

    interface ServerSound extends ServerCommand {
        sound: string;
    }
}
