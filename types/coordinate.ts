
export class Coordinate {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static FromArray(arr: number[]) {
        if (arr == null) {
            return null;
        }
        
        return new Coordinate(arr[0], arr[1]);
    }

    public isOnField(): boolean {
        return this.x >= 0 && this.x <= 25 && this.y >= 0 && this.y <= 14;
    }

    public add(x: number, y: number) {
        return new Coordinate(this.x+x, this.y+y);
    }
}
