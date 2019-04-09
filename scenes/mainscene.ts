import Phaser from "phaser";
import * as Core from "../core";
import * as Model from "../model";
import * as Types from "../types";
import * as Layers from "./layers";
import * as Scenes from "../scenes";
import * as Comp from "./components";
import Point = Phaser.Geom.Point;

export class MainScene extends Scenes.AbstractScene implements Types.EventListener {
    private i: Phaser.Input.InputPlugin;
    private dragStart: Phaser.Geom.Point;
    private scale: number;
    private width: number;
    private height: number;
    private dirty: boolean;
    private uiCamera: Phaser.Cameras.Scene2D.Camera;
    private blockDiceKey: string;
    private currentCamera: Layers.CameraView;
    private worldLayer: Layers.World;
    private uiLayer: Layers.UI;


    public constructor(controller: Core.Controller) {
        super('mainScene', controller);
        console.log("Main Scene: constructed");
        this.currentCamera = Layers.CameraView.Field;

        controller.addEventListener(this);
    }

    public handleEvent(event: Types.EventType, data?: any) {
        switch(event) {
            case Types.EventType.ModelChanged:
                this.dirty = true;
                break;
            case Types.EventType.Resizing:
                this.resize();
                break;
            case Types.EventType.Resized:
                this.controller.DiceManager.setScale(data.scale / 30);
                break;
            case Types.EventType.ToggleDugouts:
                this.worldLayer.toggleDugouts(this.cameras.main);
                break;
            case Types.EventType.ActivePlayerAction:
                let activePlayer = this.controller.Game.getActivePlayer();
                this.worldLayer.floatText(activePlayer, <string>data);
                break;
            case Types.EventType.FloatText:
                this.worldLayer.floatText(data.player, data.text);
                break;
            case Types.EventType.BlockDice:
                if (this.blockDiceKey != null) {
                    this.controller.DiceManager.fadeRoll(this.blockDiceKey);
                }
                this.blockDiceKey = data;
                break;
            case Types.EventType.BlockChoice:
                let choice: number = data.choice;
                if (this.blockDiceKey !== null) {
                    this.controller.DiceManager.displayBlockChoice(this.blockDiceKey, choice);
                    this.blockDiceKey = null;
                }
                break;
            case Types.EventType.Kickoff:
                this.worldLayer.kickoff(data.kickoff);
                break;
        }
    }

    public init(config) {
        console.log('Main Scene: init', config);

        this.scale = 1.0;

        this.width = this.sys.canvas.width;
        this.height = this.sys.canvas.height;
    }

    public preload() {
        console.log('Main Scene: preload');
    }

    public create(config) {
        console.log('Main Scene: create', config);

        let game = this.controller.getGameState();

        this.worldLayer = new Layers.World(this, game, this.controller);
        this.worldLayer.create();
        this.add.existing(this.worldLayer.getView());

        const FAR_AWAY = -10000;

        // Set up UI overlay
        this.uiLayer = new Layers.UI(this, game, this.controller);

        this.uiLayer.container.setPosition(FAR_AWAY, FAR_AWAY);
        this.add.existing(this.uiLayer.container);

        //this.cameras.main.setBounds(0, 0, 0, 0);
        this.cameras.main.setRoundPixels(true);

        let uiCamera = this.cameras.add(0, 0, this.width, this.height);
        uiCamera.setZoom(1);
        uiCamera.setScroll(FAR_AWAY, FAR_AWAY);
        this.uiCamera = uiCamera;

        window.onresize = () => {
            this.controller.triggerEvent(Types.EventType.Resizing);
        };

        this.redraw(this.controller.getGameState());
        this.resize();

        this.controller.triggerEvent(Types.EventType.Initialized);
        this.controller.SoundEngine.start();

        let prevX = -1;
        let prevY = -1;
        let fieldSquare = new Types.Coordinate(0, 0);

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer, gameObject) => {
            let p = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

            let x = p.x;
            let y = p.y;

            this.uiLayer.setDebugText(Math.round(pointer.x) + "," + Math.round(pointer.y) + " :: " + Math.round(p.x) + "," + Math.round(p.y));

            let gridSize = this.getGridSize();
            let sX = Math.floor(x / gridSize);
            let sY = Math.floor(y / gridSize);

            if (sX != prevX ||sY != prevY) {
                prevX = sX;
                prevY = sY;

                fieldSquare.x = sX;
                fieldSquare.y = sY;

                let player = this.controller.Game.getPlayerOnLocation(fieldSquare);

                if (player != null) {
                    let location = this.controller.findEmptyPatchNearLocation(fieldSquare, 3, 4);
                    let pos = this.controller.convertToPixels(location);
                    let sz = this.controller.convertToPixels(new Types.Coordinate(3, 4));
                    pos[0] -= this.cameras.main.scrollX;
                    pos[1] -= this.cameras.main.scrollY;
                    this.uiLayer.setPlayerCard(player, pos, sz);
                } else {
                    this.uiLayer.setPlayerCard(null);
                }
            }
        });
    }

    public resize() {
        this.sys.canvas.style.width = "100%";
        this.sys.canvas.style.height = "100%";

        let w = this.sys.canvas.clientWidth;
        let h = this.sys.canvas.clientHeight;

        this.width = w;
        this.height = h;

        this.sys.game.resize(w, h);

        let marginTop = h / 16;
        let marginBottom = 0;
        let marginLeft = 0;
        let marginRight = 0;

        w -= marginLeft + marginRight;
        h -= marginTop + marginBottom;

        this.worldLayer.resize(w, h);

        this.controller.triggerEvent(Types.EventType.ModelChanged);

        this.cameras.main.setViewport(0, 0, this.width, this.height + marginTop);
        this.worldLayer.setCamera(this.cameras.main, Layers.CameraView.Field, false);

        this.uiCamera.setViewport(0, 0, this.width, this.height);
    }

    public getGridSize(): number {
        return this.worldLayer.getGridSize();
    }

    public update() {

        if (this.dirty) {
            this.redraw(this.controller.getGameState());
            this.dirty = false;
        }
    }

    public redraw(game: Model.Game) {
        this.worldLayer.redraw();
    }

}
