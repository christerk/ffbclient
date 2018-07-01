
export class Coordinate extends Array<number> {
    public constructor(x: number, y: number) {
        super(x, y);
    }

    public get x(): number {
        return this[0];
    }

    public get y(): number {
        return this[1];
    }

    public static FromArray(arr: number[]) {
        if (arr == null) {
            return null;
        }
        
        return new Coordinate(arr[0], arr[1]);
    }
}
