import Phaser from "phaser";
import deepmerge from "deepmerge";
import * as Comp from "./index";
import {EventType} from "../../types";

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

export enum InputEvent {
    POINTER_UP = "pointerup",
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
    offset: {
        left: Size,
        right: Size,
        top: Size,
        bottom: Size,
    }
}

export type ComponentConfiguration = {
    id?: string,
    margin?: {
        left?: Size,
        right?: Size,
        top?: Size,
        bottom?: Size,
    },
    padding?: {
        left?: Size,
        right?: Size,
        top?: Size,
        bottom?: Size,
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
    adjustSize?: boolean,
    triggerRecursiveRedrawAfterAdjust?: boolean,
    interactive?: boolean,
    event?: EventType
}

export abstract class UIComponent {
    public config: ComponentConfiguration;
    //public phaserObject: Phaser.GameObjects.GameObject;
    protected ctx: RenderContext;
    private static serialCounter: number = 0;
    private isHitAreaCalculationAllowed = true;

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
            padding: {
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

    protected translateScalarWidth(size: Size) {
        return this.translateScalar(size, this.ctx.scale, this.ctx.w);
    }

    protected translateScalarHeight(size: Size) {
        return this.translateScalar(size, this.ctx.scale, this.ctx.h);
    }

    private translateScalar(size: Size, scale: number, containerSize: number) {
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

    protected pxToSize(px: number): Size {
        return px + 'px'
    }

    public getBounds(): Phaser.Geom.Rectangle {
        return this.getBoundsForContext(this.ctx);
    }

    public getBoundsForContext(ctx: RenderContext): Phaser.Geom.Rectangle {
        let parentAnchor = this.anchorFactors[this.config.parentAnchor];
        let thisAnchor = this.anchorFactors[this.config.anchor];

        let pos = {
            innerWidth: this.translateScalarWidth(this.config.width),
            innerHeight: this.translateScalarHeight(this.config.height),
            margin: {
                left: this.translateScalarWidth(this.config.margin.left),
                right: this.translateScalarWidth(this.config.margin.right),
                top: this.translateScalarHeight(this.config.margin.top),
                bottom: this.translateScalarHeight(this.config.margin.bottom),
            },
            offset: {
                left: this.translateScalarWidth(this.ctx.offset.left),
                right: this.translateScalarWidth(this.ctx.offset.right),
                top: this.translateScalarHeight(this.ctx.offset.top),
                bottom: this.translateScalarHeight(this.ctx.offset.bottom),
            },
            outerWidth: 0,
            outerHeight: 0,
        };

        pos.outerWidth = pos.innerWidth + this.horizontalPadding() + pos.margin.left + pos.margin.right + pos.offset.left + pos.offset.right;
        pos.outerHeight = pos.innerHeight + this.verticalPadding() + pos.margin.top + pos.margin.bottom + pos.offset.top + pos.offset.bottom;

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
        this.config.margin.left = this.pxToSize(x);
        this.config.margin.top = this.pxToSize(y);
    }

    public setSize(w: number, h: number) {
        this.config.width = this.pxToSize(w);
        this.config.height = this.pxToSize(h);
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
        this.redrawSelfAfterChildren();
        this.calculateHitAreaIfAllowed();
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

    public adjustWidthToParent(widthWithExtras: Size): number {
        let width = this.translateScalarWidth(widthWithExtras) -
            this.horizontalPadding() -
            this.horizontalMargin();

        let difference = width -
            this.translateScalarWidth(this.config.width) ;
        this.config.width = this.pxToSize(width);
        this.config.adjustSize = false;
        return difference;
    }

    public adjustHeightToParent(heightWithExtras: Size): number {
        let height = this.translateScalarHeight(heightWithExtras) -
            this.verticalPadding() -
            this.verticalMargin();

        let difference = height -
            this.translateScalarHeight(this.config.height) ;
        this.config.height = this.pxToSize(height);
        this.config.adjustSize = false;
        return difference;
    }

    public adjustLeftPositionOffset(left: number) {
        this.ctx.offset.left = this.pxToSize(this.translateScalarWidth(this.ctx.offset.left) + left);
    }

    public adjustTopPositionOffset(top: number) {
        this.ctx.offset.top = this.pxToSize(this.translateScalarHeight(this.ctx.offset.top) + top);
    }
    public getWidthForParent(): number {
        return this.getBounds().width +
            this.horizontalPadding() +
            this.horizontalMargin();
    }

    public getHeightForParent(): number {
        return this.getBounds().height +
            this.verticalPadding() +
            this.verticalMargin();
    }

    public setAllowHitAreaCalculation(isAllowed: boolean): void {
        this.isHitAreaCalculationAllowed = isAllowed;
    }

    public calculateHitAreaIfAllowed(): void {
        if (this.isHitAreaCalculationAllowed && this.config.interactive) {
            this.calculateHitArea();
        }
    }

    public calculateHitArea(): void {}

    protected getInputElements(): Phaser.GameObjects.GameObject[] {
        return [];
    }

    public addPointerUp(eventHandler: Function): void {
        this.getInputElements().forEach( function(inputElement: Phaser.GameObjects.GameObject) {
            inputElement.on(InputEvent.POINTER_UP, eventHandler);
        });
    }

    public abstract show(): void;
    public abstract hide(): void;
    public abstract create(): Phaser.GameObjects.GameObject;
    public abstract destroy(): void;

    protected createBackground(bounds: Phaser.Geom.Rectangle): Phaser.GameObjects.Image {
        let bg = this.ctx.scene.make.graphics({});
        let alpha = this.config.backgroundAlpha;
        if (alpha === null || alpha === undefined) {
            alpha = 1;
        }

        bg.fillStyle(this.config.background, alpha);
        bg.fillRect(0, 0, bounds.width + this.horizontalPadding(), bounds.height + this.verticalPadding());
        let key = Comp.UIComponent.generateKey();
        bg.generateTexture(key, bounds.width + this.horizontalPadding(), bounds.height + this.verticalPadding());
        let background = new Phaser.GameObjects.Image(this.ctx.scene, 0, 0, key);
        background.setOrigin(0,0);
        background.setDisplayOrigin(0,0);
        background.setPosition(bounds.x, bounds.y);
        return background;
    }

    protected horizontalPadding() {
        return this.translateScalarWidth(this.config.padding.left) + this.translateScalarWidth(this.config.padding.right);
    }

    protected verticalPadding() {
        return this.translateScalarHeight(this.config.padding.top) + this.translateScalarHeight(this.config.padding.bottom);
    }

    protected horizontalMargin() {
        return this.translateScalarWidth(this.config.margin.left) + this.translateScalarWidth(this.config.margin.right);
    }

    protected verticalMargin() {
        return this.translateScalarHeight(this.config.margin.top) + this.translateScalarHeight(this.config.margin.bottom);
    }
}