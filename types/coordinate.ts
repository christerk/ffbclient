
export default class Coordinate extends Array<integer> {
    public constructor(x: integer, y: integer) {
        super(x, y);
    }

    public get x(): integer {
        return this[0];
    }

    public get y(): integer {
        return this[1];
    }
}
