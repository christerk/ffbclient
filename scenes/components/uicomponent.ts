import Phaser from "phaser";
import deepmerge from "deepmerge";
import * as Comp from "./index";

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

export type Size = number|string;

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
    margin?: {
        left?: Size,
        right?: Size,
        top?: Size,
        bottom?: Size,
    },
    offset?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    },
    width?: Size,
    height?: Size,
    anchor?: Anchor,
    parentAnchor?: Anchor,
    background?: number,
    backgroundAlpha?: number,
    color?: number,
    children?: UIComponent[],
    visible?: boolean,
    inheritVisibility?: boolean,
    text?: string,
    image?: string,
    adjustSize?: boolean
}

export abstract class UIComponent {
    protected config: ComponentConfiguration;
    //public phaserObject: Phaser.GameObjects.GameObject;
    protected ctx: RenderContext;
    private static serialCounter: number = 0;

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
            margin: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
            offset: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
            width: 1,
            height: 1,
            anchor: Anchor.CENTER,
            parentAnchor: Anchor.CENTER,
            color: 0xffffff,
            background: null,
            backgroundAlpha: 1,
            visible: true,
            inheritVisibility: true,
            children: []
        };

        // Hack to avoid children being merged (causes problems)
        let children = config.children;
        config.children = null;

        this.config = deepmerge(defaults, config);

        // Restore children array
        config.children = children;
    }

    public get InheritVisibility(): boolean {
        return this.config.inheritVisibility;
    }

    protected static generateKey(): string {
        this.serialCounter++;
        return "UIComponent:" + this.serialCounter;
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

    public getBounds(ctx: RenderContext): Phaser.Geom.Rectangle {
        let parentAnchor = this.anchorFactors[this.config.parentAnchor];
        let thisAnchor = this.anchorFactors[this.config.anchor];

        let pos = {
            innerWidth: this.translateScalar(this.config.width, ctx.scale, ctx.w),
            innerHeight: this.translateScalar(this.config.height, ctx.scale, ctx.h),
            margin: {
                left: this.translateScalar(this.config.margin.left, ctx.scale, ctx.w),
                right: this.translateScalar(this.config.margin.right, ctx.scale, ctx.w),
                top: this.translateScalar(this.config.margin.top, ctx.scale, ctx.h),
                bottom: this.translateScalar(this.config.margin.bottom, ctx.scale, ctx.h),
            },
            offset: {
                left: this.translateScalar(this.config.offset.left, ctx.scale, ctx.w),
                right: this.translateScalar(this.config.offset.right, ctx.scale, ctx.w),
                top: this.translateScalar(this.config.offset.top, ctx.scale, ctx.h),
                bottom: this.translateScalar(this.config.offset.bottom, ctx.scale, ctx.h),
            },
            outerWidth: 0,
            outerHeight: 0,
        };

        pos.outerWidth = pos.innerWidth + pos.margin.left + pos.margin.right + pos.offset.left + pos.offset.right;
        pos.outerHeight = pos.innerHeight + pos.margin.top + pos.margin.bottom + pos.offset.top + pos.offset.bottom;

        let centerX = (parentAnchor[0] * ctx.w) + ((0.5-thisAnchor[0])*pos.outerWidth) + ctx.x;
        let centerY = (parentAnchor[1] * ctx.h) + ((0.5-thisAnchor[1])*pos.outerHeight) + ctx.y;

        let x = centerX - pos.outerWidth / 2 + pos.margin.left + pos.offset.left;
        let y = centerY - pos.outerHeight / 2 + pos.margin.top + pos.offset.top;

        return new Phaser.Geom.Rectangle(x, y, pos.innerWidth, pos.innerHeight);
    }

    public setContext(ctx: RenderContext) {
        this.ctx = ctx;
    }

    public isVisible(): boolean {
        return this.config.visible;
    }

    public setPosition(x: number, y: number) {
        this.config.margin.left = x + "px";
        this.config.margin.top = y + "px";
    }

    public setPositionOffset(left: number, top: number = 0, right: number = 0, bottom: number = 0) {
        this.config.offset.left = left;
        this.config.offset.top = top;
        this.config.offset.right = right;
        this.config.offset.bottom = bottom;
    }

    public adjustPositionOffset(left: number, top: number = 0, right: number = 0, bottom: number = 0) {
        this.config.offset.left += left;
        this.config.offset.top += top;
        this.config.offset.right += right;
        this.config.offset.bottom += bottom;
    }

    public setSize(w: number, h: number) {
        this.config.width = w + "px";
        this.config.height = h + "px";
    }

    public setVisible(visible: boolean) {
        if (this.config.visible != visible) {
            this.config.visible = visible;

            if (visible) {
                this.show();
            } else {
                this.hide();
            }

            this.redraw();
        }
    }

    public postCreate() {
        this.setVisible(this.config.visible);
    }

    public redraw(): void {
        this.redrawSelfBeforeChildren();
        this.redrawChildren();
        this.redrawSelfAfterChildren()
    }

    public redrawSelf(): void {
        this.redrawSelfBeforeChildren();
        this.redrawSelfAfterChildren()
    }

    public redrawSelfBeforeChildren(): void {
        if (this.config.visible) {
            this.show();
        } else {
            this.hide();
        }
    }

    public redrawSelfAfterChildren(): void {

    }

    public redrawChildren(): void {

    }

    public adjustWidthToParent(width: Size): number {
        let difference = this.translateScalar(width, this.ctx.scale, this.ctx.w) -
            this.translateScalar(this.config.width, this.ctx.scale, this.ctx.w) ;
        this.config.width = width;
        return difference;
    }

    public getWidthForParent(): number {
        return this.getBounds(this.ctx).width
    }

    public abstract show(): void;
    public abstract hide(): void;
    public abstract create(): Phaser.GameObjects.GameObject;
    public abstract destroy(): void;
}