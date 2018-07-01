import Phaser from "phaser";

export enum Anchor {
    CENTER = 0,
    EAST = 1,
    NORTHEAST = 2,
    NORTH = 3,
    NORTHWEST = 4,
    WEST = 5,
    SOUTHWEST = 6,
    SOUTH = 7,
    SOUTHEAST = 8,
}

type Size = number|string;

class Bounds {
    public x: Size;
    public y: Size;
    public w: Size;
    public h: Size;

    public constructor(x: Size, y: Size, w: Size, h: Size) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

export type RenderContext = {
    scene: Phaser.Scene,
    parent: UIComponent,
    x: number,
    y: number,
    w: number,
    h: number,
    scale: number,
}

export type ComponentConfiguration = {
    id?: string,
    x?: Size,
    y?: Size,
    width?: Size,
    height?: Size,
    anchor?: Anchor,
    parentAnchor?: Anchor,
    background?: number,
    color?: number,
    children?: UIComponent[]
}

export abstract class UIComponent {
    protected config: ComponentConfiguration;
    protected bounds: Bounds;
    public phaserObject: Phaser.GameObjects.GameObject;

    private anchorFactors: [number,number][] = [
        [0.5, 0.5],
        [1.0, 0.5],
        [1.0, 0.0],
        [0.5, 0.0],
        [0.0, 0.0],
        [0.0, 0.5],
        [0.0, 1.0],
        [0.5, 1.0],
        [1.0, 1.0],
    ];

    public constructor(config: ComponentConfiguration) {
        let defaults: ComponentConfiguration = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            anchor: Anchor.CENTER,
            parentAnchor: Anchor.CENTER,
            color: 0xffffff,
            background: null,
            children: [],
        };

        this.config = { ...defaults, ...config };

        this.bounds = new Bounds(this.config.x, this.config.y, this.config.width, this.config.height);
    }

    protected numberToRGBString(data: number): string {
        if (data != null) {
            return "#"+ ('000000' + ((data)>>>0).toString(16)).slice(-6);
        }
        return null;
    }

    protected translateScalar(size: Size, scale: number, containerSize: number) {
        let result = 0;

        if (typeof size === "string") {
            let parts = size.match(/^(-?[0-9]+\.?[0-9]*)\s*([^0-9.]+)?$/);
            if (parts == null) {
                result = 0;
            } else if (parts[2] === undefined) {
                result = scale * (new Number(size)).valueOf();
            } else {
                let num = new Number(parts[1]).valueOf();
                let unit = parts[2];

                if (unit == "%") {
                    result = containerSize * num / 100;
                } else if (unit == "px") {
                    result = num;
                }
            }
        } else {
            result = scale * size;
        }

        return result;
    }

    public getBounds(ctx: RenderContext, debug = false): Phaser.Geom.Rectangle {
        let parentAnchor = this.anchorFactors[this.config.parentAnchor];
        let thisAnchor = this.anchorFactors[this.config.anchor];

        if (debug) console.log("----", this.config.id, "----");

        if (debug) console.log("Bounds(", ctx.w, ",", ctx.h, ",", ctx.scale, ")");

        let w = this.translateScalar(this.bounds.w, ctx.scale, ctx.w);
        let h = this.translateScalar(this.bounds.h, ctx.scale, ctx.h);

        if (debug) console.log("w = trn(", this.bounds.w, ",", ctx.scale, ",", ctx.w, ") =", w);
        if (debug) console.log("h = trn(", this.bounds.h, ",", ctx.scale, ",", ctx.h, ") =", h);

        let cX = (parentAnchor[0] * ctx.w) + ((0.5-thisAnchor[0])*w);
        let cY = (parentAnchor[1] * ctx.h) + ((0.5-thisAnchor[1])*h);

        if (debug) console.log("cX =", parentAnchor[0],"*", ctx.w, "+ ((0.5 -", thisAnchor[0], ") *", w, " =", cX);
        if (debug) console.log("cY =", parentAnchor[1],"*", ctx.h, "+ ((0.5 -", thisAnchor[1], ") *", h, " =", cY);

        let offsetX = this.translateScalar(this.bounds.x, ctx.scale, ctx.w);
        let offsetY = this.translateScalar(this.bounds.y, ctx.scale, ctx.h);

        if (debug) console.log("offsetX = trn(", this.bounds.x, ",", ctx.scale, ",", ctx.w,") =", offsetX);
        if (debug) console.log("offsetY = trn(", this.bounds.y, ",", ctx.scale, ",", ctx.h,") =", offsetY);

        let left = cX - w / 2 + offsetX + ctx.x;
        let top = cY - h / 2 + offsetY + ctx.y;

        if (debug) console.log("left =", cX, "-", w, "/ 2 +", offsetX, "+", ctx.x, "=", left);
        if (debug) console.log("top =", cY, "-", h, "/ 2 +", offsetY, "+", ctx.y, "=", top);

        return new Phaser.Geom.Rectangle(left, top, w, h);
    }

    public abstract render(context: RenderContext): Phaser.GameObjects.GameObject;

}