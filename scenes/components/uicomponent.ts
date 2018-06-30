import Phaser from "phaser";

export enum Anchor {
    CENTER = 0,
    EAST = 1,
    NORTHEAST = 2,
    NORTH = 3,
    NORTWEST = 4,
    WEST = 5,
    SOUTHWEST = 6,
    SOUTH = 7,
    SOUTHEAST = 8,
}

export type ComponentConfiguration = {
    x: number,
    y: number,
    width: number,
    height: number,
    anchor: Anchor,
    parentAnchor: Anchor,
    background?: number;
}

export class UIComponent {
    private parentAnchor: Anchor;
    private anchor: Anchor;
    protected bounds: Phaser.Geom.Rectangle;
    private scalingFactors: Phaser.Math.Vector2;
    public graphic: Phaser.GameObjects.GameObject;
    private background: number;

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
        this.bounds = new Phaser.Geom.Rectangle(config.x, config.y, config.width, config.height);
        this.anchor = config.anchor;
        this.parentAnchor = config.parentAnchor;
        this.background = config.background;
    }

    public getBounds(width: number, height: number): Phaser.Geom.Rectangle {
        let parentAnchor = this.anchorFactors[this.parentAnchor];
        let thisAnchor = this.anchorFactors[this.anchor];

        let w = width * this.bounds.width;
        let h = height * this.bounds.height;

        let cX = (parentAnchor[0] * width) + ((0.5-thisAnchor[0])*w);
        let cY = (parentAnchor[1] * height) + ((0.5-thisAnchor[1])*h);

        let left = cX - w / 2 + this.bounds.x;
        let top = cY - h / 2 + this.bounds.y;

        return new Phaser.Geom.Rectangle(left, top, w, h);
    }

    public render(parent: Phaser.Scene, w: number, h: number): Phaser.GameObjects.GameObject {
        let bounds = this.getBounds(w, h);
        let g = parent.make.graphics({});

        if (this.background != null) {
            g.fillStyle(this.background, 1);
            g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        }
        g.setPosition(0, 0);
        this.graphic = g;

        return g;
    }
}