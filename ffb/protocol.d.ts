declare namespace FFB.Protocol.Messages {
    type Coordinate = Array<number>;

    enum PlayerState {}

    type BloodSpotType = {
        coordinate: Coordinate;
        injury:     PlayerState;
    }

// DIALOG_ID("dialogId"),  DIALOG_PARAMETER("dialogParameter"),     RANGE_RULER("rangeRuler")
  

    type ModelChangeType = {
        modelChangeId:      string;
        modelChangeKey:     string;
        modelChangeValue:   null | boolean | string | number | PlayerAction | Skill | Date | TurnMode |
                            Coordinate | PlayerState | SeriousInjury | SendToBoxReason | BloodSpotType |
                            TrackNumberType | PushbackSquare | MoveSquare | Weather | DiceDecoration |
                            Inducement | FieldMarker | PlayerMarkerType | GameOption | Card | LeaderState |
                            CardEffect | DialogId | RangeRuler;
    }

    type ModelChangeListType = {
        modelChangeArray: ModelChangeType[];
    }
    
    type DialogId = {
        // INFORMATION("information"),  YES_OR_NO_QUESTION("yesOrNoQuestion"),  GAME_COACH_PASSWORD("gameCoachPassword"),  TEAM_CHOICE("teamChoice"),  COIN_CHOICE("coinChoice"),  RE_ROLL("reRoll"),  SKILL_USE("skillUse"),  PROGRESS_BAR("progressBar"),  TEAM_SETUP("teamSetup"),  USE_APOTHECARY("useApothecary"),  RECEIVE_CHOICE("receiveChoice"),  FOLLOWUP_CHOICE("followupChoice"),  START_GAME("startGame"),  APOTHECARY_CHOICE("apothecaryChoice"),  TOUCHBACK("touchback"),  INTERCEPTION("interception"),  SETUP_ERROR("setupError"),  GAME_STATISTICS("gameStatistics"),  WINNINGS_RE_ROLL("winningsReRoll"),  GAME_CHOICE("gameChoice"),  KEY_BINDINGS("keyBindings"),  BLOCK_ROLL("blockRoll"),  PLAYER_CHOICE("playerChoice"),  DEFENDER_ACTION("defenderAction"),  JOIN("join"),  CONCEDE_GAME("concedeGame"),  ABOUT("about"),  END_TURN("endTurn"),  LEAVE_GAME("leaveGame"),  BRIBES("bribes"),  PILING_ON("pilingOn"),  BUY_INDUCEMENTS("buyInducements"),  TRANSFER_PETTY_CASH("transferPettyCash"),  SOUND_VOLUME("soundVolume"),  JOURNEYMEN("journeymen"),  KICKOFF_RESULT("kickoffResult"),  CHAT_COMMANDS("chatCommands"),  KICK_SKILL("kickSkill"),  USE_IGOR("useIgor"),  KICKOFF_RETURN("kickoffReturn"),  PETTY_CASH("pettyCash"),  WIZARD_SPELL("wizardSpell"),  USE_INDUCEMENT("useInducement"),  PASS_BLOCK("passBlock"),  BUY_CARDS("buyCards"),  ARGUE_THE_CALL("argueTheCall");
        name: string;
    }

    type RangeRuler = {
        throwerId:          string;
        targetCoordinate:   Coordinate;
        minimumRoll:        number;
        throwTeamMate:      boolean;

    }

    type CardEffect = {
        // DISTRACTED("Distracted"),  ILLEGALLY_SUBSTITUTED("IllegallySubstituted"),  MAD_CAP_MUSHROOM_POTION("MadCapMushroomPotion"),  SEDATIVE("Sedative"),  POISONED("Poisoned");
        name: string;
    }

    type Card = {
       name: string
    }
   
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
        coordinate:    Coordinate;
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
        playerResults:          [string, PlayerResult];
        pettyCashTransferred:   number;
        pettyCashUsed:          number;
        teamValue:              number;
    }

    type GameResult = {
        teamResultHome: TeamResult; 
        teamResultAway: TeamResult; 
    }

    type LeaderState = {
        //NONE("none"),  AVAILABLE("available"),  USED("used");
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
        turnNumber:             number;
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
        // ALWAYS_HUNGRY_ROLL("alwaysHungryRoll"),  ARGUE_THE_CALL("argueTheCall"),  CATCH_ROLL("catchRoll"),  CONFUSION_ROLL("confusionRoll"),  DAUNTLESS_ROLL("dauntlessRoll"),  DODGE_ROLL("dodgeRoll"),  ESCAPE_ROLL("escapeRoll"),  FOUL_APPEARANCE_ROLL("foulAppearanceRoll"),  GO_FOR_IT_ROLL("goForItRoll"),  INTERCEPTION_ROLL("interceptionRoll"),  LEAP_ROLL("leapRoll"),  PASS_ROLL("passRoll"),  PICK_UP_ROLL("pickUpRoll"),  RIGHT_STUFF_ROLL("rightStuffRoll"),  REGENERATION_ROLL("regenerationRoll"),  SAFE_THROW_ROLL("safeThrowRoll"),  TENTACLES_SHADOWING_ROLL("tentaclesShadowingRoll"),  SKILL_USE("skillUse"),  RE_ROLL("reRoll"),  TURN_END("turnEnd"),  PLAYER_ACTION("playerAction"),  FOUL("foul"),  HAND_OVER("handOver"),  INJURY("injury"),  APOTHECARY_ROLL("apothecaryRoll"),  APOTHECARY_CHOICE("apothecaryChoice"),  THROW_IN("throwIn"),  SCATTER_BALL("scatterBall"),  BLOCK("block"),  BLOCK_CHOICE("blockChoice"),  SPECTATORS("spectators"),  WEATHER("weather"),  COIN_THROW("coinThrow"),  RECEIVE_CHOICE("receiveChoice"),  KICKOFF_RESULT("kickoffResult"),  KICKOFF_SCATTER("kickoffScatter"),  KICKOFF_EXTRA_REROLL("extraReRoll"),  KICKOFF_RIOT("kickoffRiot"),  KICKOFF_THROW_A_ROCK("kickoffThrowARock"),  PUSHBACK("pushback"),  REFEREE("referee"),  KICKOFF_PITCH_INVASION("kickoffPitchInvasion"),  THROW_TEAM_MATE_ROLL("throwTeamMateRoll"),  SCATTER_PLAYER("scatterPlayer"),  TIMEOUT_ENFORCED("timeoutEnforced"),  WINNINGS_ROLL("winningsRoll"),  FUMBBL_RESULT_UPLOAD("fumbblResultUpload"),  FAN_FACTOR_ROLL("fanFactorRoll"),  MOST_VALUABLE_PLAYERS("mostValuablePlayers"),  DEFECTING_PLAYERS("defectingPlayers"),  JUMP_UP_ROLL("jumpUpRoll"),  STAND_UP_ROLL("standUpRoll"),  BRIBES_ROLL("bribesRoll"),  MASTER_CHEF_ROLL("masterChefRoll"),  START_HALF("startHalf"),  INDUCEMENT("inducement"),  PILING_ON("pilingOn"),  CHAINSAW_ROLL("chainsawRoll"),  LEADER("leader"),  SECRET_WEAPON_BAN("secretWeaponBan"),  BLOOD_LUST_ROLL("bloodLustRoll"),  HYPNOTIC_GAZE_ROLL("hypnoticGazeRoll"),  BITE_SPECTATOR("biteSpectator"),  ANIMOSITY_ROLL("animosityRoll"),  RAISE_DEAD("raiseDead"),  BLOCK_ROLL("blockRoll"),  PENALTY_SHOOTOUT("penaltyShootout"),  DOUBLE_HIRED_STAR_PLAYER("doubleHiredStarPlayer"),  SPELL_EFFECT_ROLL("spellEffectRoll"),  WIZARD_USE("wizardUse"),  GAME_OPTIONS("gameOptions"),  PASS_BLOCK("passBlock"),  NO_PLAYERS_TO_FIELD("noPlayersToField"),  PLAY_CARD("playCard"),  CARD_DEACTIVATED("cardDeactivated"),  BOMB_OUT_OF_BOUNDS("bombOutOfBounds"),  PETTY_CASH("pettyCash"),  INDUCEMENTS_BOUGHT("inducementsBought"),  CARDS_BOUGHT("cardsBought"),  CARD_EFFECT_ROLL("cardEffectRoll"),  WEEPING_DAGGER_ROLL("weepingDaggerRoll");
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

    type Report = BlockReport | BlockRollReport | GoForItReport | InjuryReport | DodgeRollRport;

    type ReportList = {
        reports: Report[];
        sound: string;
        turnTime: number;
    }

    type AnimationType = {
        //PASS("pass"),  THROW_TEAM_MATE("throwTeamMate"),  KICK("kick"),  SPELL_FIREBALL("spellFireball"),  SPELL_LIGHTNING("spellLightning"),  KICKOFF_BLITZ("kickoffBlitz"),  KICKOFF_BLIZZARD("kickoffBlizzard"),  KICKOFF_BRILLIANT_COACHING("kickoffBrilliantCoaching"),  KICKOFF_CHEERING_FANS("kickoffCheeringFans"),  KICKOFF_GET_THE_REF("kickoffGetTheRef"),  KICKOFF_HIGH_KICK("kickoffHighKick"),  KICKOFF_NICE("kickoffNice"),  KICKOFF_PERFECT_DEFENSE("kickoffPerfectDefense"),  KICKOFF_PITCH_INVASION("kickoffPitchInvasion"),  KICKOFF_POURING_RAIN("kickoffPouringRain"),  KICKOFF_QUICK_SNAP("kickoffQuickSnap"),  KICKOFF_RIOT("kickoffRiot"),  KICKOFF_SWELTERING_HEAT("kickoffSwelteringHeat"),  KICKOFF_THROW_A_ROCK("kickoffThrowARock"),  KICKOFF_VERY_SUNNY("kickoffVerySunny"),  HAIL_MARY_PASS("hailMaryPass"),  THROW_A_ROCK("throwARock"),  THROW_BOMB("throwBomb"),  HAIL_MARY_BOMB("hailMaryBomb"),  BOMB_EXLOSION("bombExplosion"),  CARD("card");
        name: string;
    }

    type Animation = {
        thrownPlayerId:         string;
        withBall:               boolean;
        startCoordinate:        Coordinate;
        endCoordinate:          Coordinate;
        interceptorCoordinate:  Coordinate
        animationType:          AnimationType;
        card:                   Card;
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
}
