
/*
 UNTIL_END_OF_GAME(1, "untilEndOfGame", "For the entire game"),  UNTIL_END_OF_DRIVE(2, "untilEndOfDrive", "For this drive"),  UNTIL_END_OF_TURN(3, "untilEndOfTurn", "For this turn"),  WHILE_HOLDING_THE_BALL(4, "whileHoldingTheBall", "While holding the ball"),  UNTIL_USED(5, "untilUsed", "Single use"),  UNTIL_END_OF_OPPONENTS_TURN(6, "untilEndOfOpponentsTurn", "For opponent's turn");
 */
export default class InducementDuration {
    public id:          number;
    public name:        string;
    public description: string;
}
