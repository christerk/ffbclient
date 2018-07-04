
declare namespace FFB.Game.Objects {

 type ArmourModifier = {
     //CLAWS("Claws", 0, false),  MIGHTY_BLOW("Mighty Blow", 1, false),  FOUL_PLUS_1("1 Offensive Assist", 1, true),  FOUL_PLUS_2("2 Offensive Assists", 2, true),  FOUL_PLUS_3("3 Offensive Assists", 3, true),  FOUL_PLUS_4("4 Offensive Assists", 4, true),  FOUL_PLUS_5("5 Offensive Assists", 5, true),  FOUL_PLUS_6("6 Offensive Assists", 6, true),  FOUL_PLUS_7("7 Offensive Assists", 7, true),  FOUL_MINUS_1("1 Defensive Assist", -1, true),  FOUL_MINUS_2("2 Defensive Assists", -2, true),  FOUL_MINUS_3("3 Defensive Assists", -3, true),  FOUL_MINUS_4("4 Defensive Assists", -4, true),  FOUL_MINUS_5("5 Defensive Assists", -5, true),  DIRTY_PLAYER("Dirty Player", 1, false),  STAKES("Stakes", 1, false),  CHAINSAW("Chainsaw", 3, false),  FOUL("Foul", 1, false);
        name:               string;
        modifier:           number;
        foulAssistModifier: boolean;
    }

 type BlockResult = {
     //SKULL("SKULL"),  BOTH_DOWN("BOTH DOWN"),  PUSHBACK("PUSHBACK"),  POW_PUSHBACK("POW/PUSH"),  POW("POW");
     name: string;
 }

 type BoxType = {
     //RESERVES(1, "reserves", "Rsv", "player is in reserve.", "players are in reserve."),  OUT(2, "out", "Out", "player is out of the game.", "players are out of the game.");
     id:              string;
     name:            string;
     shortcut:        string;
     tooltipSingle:   string;
     tooltipMultiple: string;
 }

 
    /*
END_OF_OWN_TURN("endOfOwnTurn", "at end of own turn"),
START_OF_OWN_TURN("startOfOwnTurn", "at start of own turn"),
AFTER_KICKOFF_TO_OPPONENT("afterKickoffToOpponent", "after Kickoff to opponent"),
AFTER_INDUCEMENTS_PURCHASED("afterInducementsPurchased", "after Inducements are purchased"),
BEFORE_KICKOFF_SCATTER("beforeKickoffScatter", "before Kickoff Scatter"), 
END_OF_TURN_NOT_HALF("endOfTurnNotHalf", "at end of turn, not half"),  
BEFORE_SETUP("beforeSetup", "before setting up");
     */

    type InducementPhase = {
        name:        string;
        description: string;
    }
    /*
 UNTIL_END_OF_GAME(1, "untilEndOfGame", "For the entire game"),  UNTIL_END_OF_DRIVE(2, "untilEndOfDrive", "For this drive"),  UNTIL_END_OF_TURN(3, "untilEndOfTurn", "For this turn"),  WHILE_HOLDING_THE_BALL(4, "whileHoldingTheBall", "While holding the ball"),  UNTIL_USED(5, "untilUsed", "Single use"),  UNTIL_END_OF_OPPONENTS_TURN(6, "untilEndOfOpponentsTurn", "For opponent's turn");
     */
    type InducementDuration = {
        id:          number;
        name:        string;
        description: string;
    }


    enum CardType {}

    type CardTarget = {
        id:     number;
        name:   string;
    }

    /*
 BEGUILING_BRACERS("Beguiling Bracers", "Beguiling Bracers", CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false, new InducementPhase[] { InducementPhase.START_OF_OWN_TURN },
 InducementDuration.UNTIL_END_OF_GAME, "Player gets Hypnotic Gaze, Side Step & Bone-Head"),
 BELT_OF_INVULNERABILITY("Belt of Invulnerability", "Invulnerability Belt", CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false, new InducementPhase[] { InducementPhase.END_OF_OWN_TURN, InducementPhase.AFTER_KICKOFF_TO_OPPONENT },
 InducementDuration.UNTIL_END_OF_GAME, "No modifiers or re-rolls on armour rolls"),
 FAWNDOUGHS_HEADBAND("Fawndough's Headband", "Fawndough's Headband", CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false, new InducementPhase[] { InducementPhase.START_OF_OWN_TURN },
 InducementDuration.UNTIL_END_OF_TURN, "Player gets Pass & Accurate, opponents get +1 to intercept"),
 FORCE_SHIELD("Force Shield", "Force Shield", CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false,
 new InducementPhase[] { InducementPhase.END_OF_OWN_TURN, InducementPhase.AFTER_KICKOFF_TO_OPPONENT },
 InducementDuration.WHILE_HOLDING_THE_BALL, "Player gets Sure Hands & Fend"),
 GIKTAS_STRENGTH_OF_DA_BEAR("Gikta's Strength of da Bear", "Gikta's Strength",
 CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, true, new InducementPhase[] { InducementPhase.START_OF_OWN_TURN },
 InducementDuration.UNTIL_END_OF_DRIVE, "Player gets +1 ST for this drive, then -1 ST for the remainder of the game"),
 GLOVES_OF_HOLDING("Gloves of Holding", "Gloves of Holding", CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false,
 new InducementPhase[] { InducementPhase.BEFORE_KICKOFF_SCATTER }, InducementDuration.UNTIL_END_OF_GAME,
 "Player gets Catch & Sure Hands, but may not Pass or Hand-off"),  INERTIA_DAMPER("Inertia Damper", "Inertia Damper",
 CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false, new InducementPhase[] { InducementPhase.END_OF_OWN_TURN,
 InducementPhase.AFTER_KICKOFF_TO_OPPONENT }, InducementDuration.UNTIL_END_OF_DRIVE, "Opponents get -1 ST to Blitzing from 1 or more squares away"),  LUCKY_CHARM("Lucky Charm", "Lucky Charm",
 CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false, new InducementPhase[] { InducementPhase.AFTER_INDUCEMENTS_PURCHASED },
 InducementDuration.UNTIL_USED, "Ignore first armour break roll"),
 MAGIC_GLOVES_OF_JARK_LONGARM("Magic Gloves of Jark Longarm", "Magic Gloves", CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER,
 false, new InducementPhase[] { InducementPhase.END_OF_OWN_TURN, InducementPhase.AFTER_KICKOFF_TO_OPPONENT }, 
 InducementDuration.UNTIL_END_OF_DRIVE, "Player gets Pass Block & +1 to interception"),
 GOOD_OLD_MAGIC_CODPIECE("Good Old Magic Codpiece", "Magic Codpiece", CardType.MAGIC_ITEM,
 CardTarget.OWN_PLAYER, false, new InducementPhase[] { InducementPhase.AFTER_INDUCEMENTS_PURCHASED },
 InducementDuration.UNTIL_END_OF_GAME, "Player cannot be fouled and no modifiers to injury rolls"),
 RABBITS_FOOT("Rabbit's Foot", "Rabbit's Foot", CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false, new InducementPhase[]
 { InducementPhase.START_OF_OWN_TURN }, InducementDuration.UNTIL_END_OF_GAME, "Player gets Pro (not playable on a Loner)"),
 WAND_OF_SMASHING("Wand of Smashing", "Wand of Smashing", CardType.MAGIC_ITEM, CardTarget.OWN_PLAYER, false, new InducementPhase[]
 { InducementPhase.START_OF_OWN_TURN }, InducementDuration.UNTIL_END_OF_TURN, "Player gets +1 ST & Mighty Blow"),
 BLATANT_FOUL("Blatant Foul", "Blatant Foul", CardType.DIRTY_TRICK, CardTarget.TURN, false, new InducementPhase[]
 { InducementPhase.START_OF_OWN_TURN }, InducementDuration.UNTIL_END_OF_TURN, "Next foul breaks armour automatically"),
 CHOP_BLOCK("Chop Block", "Chop Block", CardType.DIRTY_TRICK, CardTarget.OWN_PLAYER, false, new InducementPhase[]
 { InducementPhase.END_OF_OWN_TURN }, InducementDuration.UNTIL_END_OF_TURN, "Unmoved player drops prone and stuns an adjacent player"),
 CUSTARD_PIE("Custard Pie", "Custard Pie", CardType.DIRTY_TRICK, CardTarget.OPPOSING_PLAYER, false, new InducementPhase[]
 { InducementPhase.START_OF_OWN_TURN }, InducementDuration.UNTIL_END_OF_TURN, "Opponent distracted as per Hypnotic Gaze"),
 DISTRACT("Distract", "Distract", CardType.DIRTY_TRICK, CardTarget.OWN_PLAYER, false, new InducementPhase[]
 { InducementPhase.END_OF_OWN_TURN, InducementPhase.AFTER_KICKOFF_TO_OPPONENT }, InducementDuration.UNTIL_END_OF_OPPONENTS_TURN,
 "Player gets Disturbing Presence & opponents in 3 squares get Bone-head"),  GREASED_SHOES("Greased Shoes", "Greased Shoes",
 CardType.DIRTY_TRICK, CardTarget.TURN, false, new InducementPhase[] { InducementPhase.END_OF_OWN_TURN, InducementPhase.AFTER_KICKOFF_TO_OPPONENT },
 InducementDuration.UNTIL_END_OF_OPPONENTS_TURN, "Opposing players need to roll 5+ to Go For It"),  GROMSKULLS_EXPLODING_RUNES("Gromskull's Exploding Runes", "Exploding Runes",
 CardType.DIRTY_TRICK, CardTarget.OWN_PLAYER, false, new InducementPhase[] { InducementPhase.BEFORE_SETUP }, InducementDuration.UNTIL_END_OF_GAME, "Player gets Bombardier, No Hands,
 Secret Weapon & -1 to pass"),  ILLEGAL_SUBSTITUTION("Illegal Substitution", "Illegal Substitution", CardType.DIRTY_TRICK, CardTarget.TURN, false, new InducementPhase[]
 { InducementPhase.START_OF_OWN_TURN }, InducementDuration.UNTIL_END_OF_TURN, "Place an extra player in your end zone"),  KICKING_BOOTS("Kicking Boots", "Kicking Boots",
 CardType.DIRTY_TRICK, CardTarget.OWN_PLAYER, false, new InducementPhase[] { InducementPhase.BEFORE_KICKOFF_SCATTER }, InducementDuration.UNTIL_END_OF_GAME,
 "Player gets Kick, Dirty Player & -1 MA"),  PIT_TRAP("Pit Trap", "Pit Trap", CardType.DIRTY_TRICK, CardTarget.ANY_PLAYER, false, new InducementPhase[]
 { InducementPhase.END_OF_OWN_TURN }, InducementDuration.UNTIL_END_OF_TURN, "Player is placed prone, no armour roll"),  SPIKED_BALL("Spiked Ball",
 "Spiked Ball", CardType.DIRTY_TRICK, CardTarget.TURN, false, new InducementPhase[] { InducementPhase.BEFORE_KICKOFF_SCATTER }, InducementDuration.UNTIL_END_OF_DRIVE,
 "Any failed pick up or catch roll results in being stabbed"),  STOLEN_PLAYBOOK("Stolen Playbook", "Stolen Playbook", CardType.DIRTY_TRICK, CardTarget.OWN_PLAYER,
 false, new InducementPhase[] { InducementPhase.END_OF_OWN_TURN }, InducementDuration.UNTIL_END_OF_DRIVE, "Player gets Pass Block and Shadowing"),
 WITCH_BREW("Witch's Brew", "Witch Brew", CardType.DIRTY_TRICK, CardTarget.OPPOSING_PLAYER, false, new InducementPhase[] { InducementPhase.BEFORE_KICKOFF_SCATTER },
 InducementDuration.UNTIL_END_OF_DRIVE, "Poison an opponent (random effect)");

     */
    type Card = {
        name:             string;
        shortName:        string;
        type:             CardType;
        target:           CardTarget;
        remainsInPlay:    boolean;
        phases:           InducementPhase[];
        duration:         InducementDuration;
        description:      string;
    }

    
    type InjuryAttribute = {
        //MA(1, "MA"),  ST(2, "ST"),  AG(3, "AG"),  AV(4, "AV"),  NI(5, "NI");
        id:     number;
        name:   string
    }


    type PlayerAction = {
        // MOVE("move", 1, "starts a Move Action"),  BLOCK("block", 2, "starts a Block Action"),  BLITZ("blitz", 3, null),  BLITZ_MOVE("blitzMove", 3, "starts a Blitz Action"),  HAND_OVER("handOver", 5, null),  HAND_OVER_MOVE("handOverMove", 5, "starts a Hand Over Action"),  PASS("pass", 7, null),  PASS_MOVE("passMove", 7, "starts a Pass Action"),  FOUL("foul", 9, null),  FOUL_MOVE("foulMove", 9, "starts a Foul Action"),  STAND_UP("standUp", 11, "stands up"),  THROW_TEAM_MATE("throwTeamMate", 12, null),  THROW_TEAM_MATE_MOVE("throwTeamMateMove", 12, null),  REMOVE_CONFUSION("removeConfusion", 14, null),  GAZE("gaze", 15, null),  MULTIPLE_BLOCK("multipleBlock", 16, "starts a Block Action"),  HAIL_MARY_PASS("hailMaryPass", 7, null),  DUMP_OFF("dumpOff", 7, null),  STAND_UP_BLITZ("standUpBlitz", 3, "stands up with Blitz"),  THROW_BOMB("throwBomb", 20, "starts a Bomb Action"),  HAIL_MARY_BOMB("hailMaryBomb", 21, null);
        name:           string;
        type:           number;
        description:    string;
    }

    type SendToBoxReason = {
        // MNG("mng", "is recovering from a Serious Injury"),  FOUL_BAN("foulBan", "was banned for fouling"),  SECRET_WEAPON_BAN("secretWeaponBan", "was banned for using a Secret Weapon"),  FOULED("fouled", "was fouled"),  BLOCKED("blocked", "was blocked"),  CROWD_PUSHED("crowdPushed", "got pushed into the crowd"),  DODGE_FAIL("dodgeFail", "failed a dodge"),  GFI_FAIL("gfiFail", "failed to go for it"),  LEAP_FAIL("leapFail", "failed a leap"),  STABBED("stabbed", "has been stabbed"),  HIT_BY_ROCK("hitByRock", "has been hit by a rock"),  EATEN("eaten", "has been eaten"),  HIT_BY_THROWN_PLAYER("hitByThrownPlayer", "has been hit by a thrown player"),  LANDING_FAIL("landingFail", "failed to land after being thrown"),  PILED_ON("piledOn", "was piled upon"),  CHAINSAW("chainsaw", "has been hit by a chainsaw"),  BITTEN("bitten", "was bitten by a team-mate"),  NURGLES_ROT("nurglesRot", "has been infected with Nurgle's Rot"),  RAISED("raised", "has been raised from the dead"),  LIGHTNING("lightning", "has been hit by a lightning bolt"),  FIREBALL("fireball", "has been hit by a fireball"),  KO_ON_PILING_ON("koOnPilingOn", "has been knocked out while Piling On"),  BOMB("bomb", "has been hit by a bomb"),  BALL_AND_CHAIN("ballAndChain", "has been hit by a ball and chain");
        name:   string;
        reason: string;
    }

      type SeriousInjury = {
          //BROKEN_RIBS("Broken Ribs (MNG)", "Broken Ribs (Miss next game)", "has broken some ribs (Miss next game)", "is recovering from broken ribs", false, null),  GROIN_STRAIN("Groin Strain (MNG)", "Groin Strain (Miss next game)", "has got a groin strain (Miss next game)", "is recovering from a groin strain", false, null),  GOUGED_EYE("Gouged Eye (MNG)", "Gouged Eye (Miss next game)", "has got a gouged eye (Miss next game)", "is recovering from a gouged eye", false, null),  BROKEN_JAW("Broken Jaw (MNG)", "Broken Jaw (Miss next game)", "has got a broken jaw (Miss next game)", "is recovering from a broken jaw", false, null),  FRACTURED_ARM("Fractured Arm (MNG)", "Fractured Arm (Miss next game)", "has got a fractured arm (Miss next game)", "is recovering from a fractured arm", false, null),  FRACTURED_LEG("Fractured Leg (MNG)", "Fractured Leg (Miss next game)", "has got a fractured leg (Miss next game)", "is recovering from a fractured leg", false, null),  SMASHED_HAND("Smashed Hand (MNG)", "Smashed Hand (Miss next game)", "has got a smashed hand (Miss next game)", "is recovering from a smashed hand", false, null),  PINCHED_NERVE("Pinched Nerve (MNG)", "Pinched Nerve (Miss next game)", "has got a pinched nerve (Miss next game)", "is recovering from a pinched nerve", false, null),  DAMAGED_BACK("Damaged Back (NI)", "Damaged Back (Niggling Injury)", "has got a damaged back (Niggling Injury)", "is recovering from a damaged back (Niggling Injury)", true, InjuryAttribute.NI),  SMASHED_KNEE("Smashed Knee (NI)", "Smashed Knee (Niggling Injury)", "has got a smashed knee (Niggling Injury)", "is recovering from a smashed knee (Niggling Injury)", true, InjuryAttribute.NI),  SMASHED_HIP("Smashed Hip (-MA)", "Smashed Hip (-1 MA)", "has got a smashed hip (-1 MA)", "is recovering from a smashed hip (-1 MA)", true, InjuryAttribute.MA),  SMASHED_ANKLE("Smashed Ankle (-MA)", "Smashed Ankle (-1 MA)", "has got a smashed ankle (-1 MA)", "is recovering from a smashed ankle (-1 MA)", true, InjuryAttribute.MA),  SERIOUS_CONCUSSION("Serious Concussion (-AV)", "Serious Concussion (-1 AV)", "has got a serious concussion (-1 AV)", "is recovering from a serious concussion (-1 AV)", true, InjuryAttribute.AV),  FRACTURED_SKULL("Fractured Skull (-AV)", "Fractured Skull (-1 AV)", "has got a fractured skull (-1 AV)", "is recovering from a fractured skull (-1 AV)", true, InjuryAttribute.AV),  BROKEN_NECK("Broken Neck (-AG)", "Broken Neck (-1 AG)", "has got a broken neck (-1 AG)", "is recovering from a broken neck (-1 AG)", true, InjuryAttribute.AG),  SMASHED_COLLAR_BONE("Smashed Collar Bone (-ST)", "Smashed Collar Bone (-1 ST)", "has got a smashed collar bone (-1 ST)", "is recovering from a smashed collar bone (-1 ST)", true, InjuryAttribute.ST),  DEAD("Dead (RIP)", "Dead (RIP)", "is dead", "is dead", true, null),  POISONED("Poisoned (MNG)", "Poisoned (Miss next game)", "has been poisoned (Miss next game)", "is recovering from being poisoned", false, null);
        name:           string;
        buttonText:     string;
        description:    string;
        recovery:       string;
        lasting:        boolean;
        injuryAttribute:InjuryAttribute;
    }

    type SkillCategory = {
        // GENERAL("General", "G"),  AGILITY("Agility", "A"),  PASSING("Passing", "P"),  STRENGTH("Strength", "S"),  MUTATION("Mutation", "M"),  EXTRAORDINARY("Extraordinary", "E"),  STAT_INCREASE("Stat Increase", "+"),  STAT_DECREASE("Stat Decrease", "-");
        name: string;
        type: string;
    }

    type Skill = {
        //ACCURATE("Accurate", SkillCategory.PASSING),  ALWAYS_HUNGRY("Always Hungry", SkillCategory.EXTRAORDINARY),  ANIMOSITY("Animosity", SkillCategory.EXTRAORDINARY),  BALL_AND_CHAIN("Ball and Chain", SkillCategory.EXTRAORDINARY),  BIG_HAND("Big Hand", SkillCategory.MUTATION),  BLOCK("Block", SkillCategory.GENERAL),  BLOOD_LUST("Blood Lust", SkillCategory.EXTRAORDINARY),  BOMBARDIER("Bombardier", SkillCategory.EXTRAORDINARY),  BONE_HEAD("Bone-Head", SkillCategory.EXTRAORDINARY),  BREAK_TACKLE("Break Tackle", SkillCategory.STRENGTH),  CATCH("Catch", SkillCategory.AGILITY),  CHAINSAW("Chainsaw", SkillCategory.EXTRAORDINARY),  CLAW("Claw", SkillCategory.MUTATION),  DAUNTLESS("Dauntless", SkillCategory.GENERAL),  DECAY("Decay", SkillCategory.EXTRAORDINARY),  DIRTY_PLAYER("Dirty Player", SkillCategory.GENERAL),  DISTURBING_PRESENCE("Disturbing Presence", SkillCategory.MUTATION),  DIVING_CATCH("Diving Catch", SkillCategory.AGILITY),  DIVING_TACKLE("Diving Tackle", SkillCategory.AGILITY),  DODGE("Dodge", SkillCategory.AGILITY),  DUMP_OFF("Dump-Off", SkillCategory.PASSING),  EXTRA_ARMS("Extra Arms", SkillCategory.MUTATION),  FAN_FAVOURITE("Fan Favourite", SkillCategory.EXTRAORDINARY),  FEND("Fend", SkillCategory.GENERAL),  FOUL_APPEARANCE("Foul Appearance", SkillCategory.MUTATION),  FRENZY("Frenzy", SkillCategory.GENERAL),  GRAB("Grab", SkillCategory.STRENGTH),  GUARD("Guard", SkillCategory.STRENGTH),  HAIL_MARY_PASS("Hail Mary Pass", SkillCategory.PASSING),  HORNS("Horns", SkillCategory.MUTATION),  HYPNOTIC_GAZE("Hypnotic Gaze", SkillCategory.EXTRAORDINARY),  JUGGERNAUT("Juggernaut", SkillCategory.STRENGTH),  JUMP_UP("Jump Up", SkillCategory.AGILITY),  KICK("Kick", SkillCategory.GENERAL),  KICK_OFF_RETURN("Kick-Off Return", SkillCategory.GENERAL),  LEADER("Leader", SkillCategory.PASSING),  LEAP("Leap", SkillCategory.AGILITY),  LONER("Loner", SkillCategory.EXTRAORDINARY),  MIGHTY_BLOW("Mighty Blow", SkillCategory.STRENGTH),  MOUNSTROUS_MOUTH("Monstrous Mouth", SkillCategory.EXTRAORDINARY),  MULTIPLE_BLOCK("Multiple Block", SkillCategory.STRENGTH),  NERVES_OF_STEEL("Nerves of Steel", SkillCategory.PASSING),  NO_HANDS("No Hands", SkillCategory.EXTRAORDINARY),  NURGLES_ROT("Nurgle's Rot", SkillCategory.EXTRAORDINARY),  PASS("Pass", SkillCategory.PASSING),  PASS_BLOCK("Pass Block", SkillCategory.GENERAL),  PILING_ON("Piling On", SkillCategory.STRENGTH),  PREHENSILE_TAIL("Prehensile Tail", SkillCategory.MUTATION),  PRO("Pro", SkillCategory.GENERAL),  REALLY_STUPID("Really Stupid", SkillCategory.EXTRAORDINARY),  REGENERATION("Regeneration", SkillCategory.EXTRAORDINARY),  RIGHT_STUFF("Right Stuff", SkillCategory.EXTRAORDINARY),  SAFE_THROW("Safe Throw", SkillCategory.PASSING),  SECRET_WEAPON("Secret Weapon", SkillCategory.EXTRAORDINARY),  SHADOWING("Shadowing", SkillCategory.GENERAL),  SIDE_STEP("Side Step", SkillCategory.AGILITY),  SNEAKY_GIT("Sneaky Git", SkillCategory.AGILITY),  SPRINT("Sprint", SkillCategory.AGILITY),  STAB("Stab", SkillCategory.EXTRAORDINARY),  STAKES("Stakes", SkillCategory.EXTRAORDINARY),  STAND_FIRM("Stand Firm", SkillCategory.STRENGTH),  STRIP_BALL("Strip Ball", SkillCategory.GENERAL),  STRONG_ARM("Strong Arm", SkillCategory.STRENGTH),  STUNTY("Stunty", SkillCategory.EXTRAORDINARY),  SURE_FEET("Sure Feet", SkillCategory.AGILITY),  SURE_HANDS("Sure Hands", SkillCategory.GENERAL),  TACKLE("Tackle", SkillCategory.GENERAL),  TAKE_ROOT("Take Root", SkillCategory.EXTRAORDINARY),  TENTACLES("Tentacles", SkillCategory.MUTATION),  THICK_SKULL("Thick Skull", SkillCategory.STRENGTH),  THROW_TEAM_MATE("Throw Team-Mate", SkillCategory.EXTRAORDINARY),  TIMMMBER("Timmm-ber!", SkillCategory.EXTRAORDINARY),  TITCHY("Titchy", SkillCategory.EXTRAORDINARY),  TWO_HEADS("Two Heads", SkillCategory.MUTATION),  VERY_LONG_LEGS("Very Long Legs", SkillCategory.MUTATION),  WEEPING_DAGGER("Weeping Dagger", SkillCategory.EXTRAORDINARY),  WILD_ANIMAL("Wild Animal", SkillCategory.EXTRAORDINARY),  WRESTLE("Wrestle", SkillCategory.GENERAL),  MOVEMENT_INCREASE("+MA", SkillCategory.STAT_INCREASE),  MOVEMENT_DECREASE("-MA", SkillCategory.STAT_DECREASE),  STRENGTH_INCREASE("+ST", SkillCategory.STAT_INCREASE),  STRENGTH_DECREASE("-ST", SkillCategory.STAT_DECREASE),  AGILITY_INCREASE("+AG", SkillCategory.STAT_INCREASE),  AGILITY_DECREASE("-AG", SkillCategory.STAT_DECREASE),  ARMOUR_INCREASE("+AV", SkillCategory.STAT_INCREASE),  ARMOUR_DECREASE("-AV", SkillCategory.STAT_DECREASE);
        name:       string;
        category:   SkillCategory;
    }

}








