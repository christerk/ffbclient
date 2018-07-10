import Phaser from "phaser";
import CommandHandler from "../commandhandler";
import * as Model from "../model";
import Controller from "../controller";
import { EventListener, EventType } from "../types/eventlistener";
import { Coordinate } from "../types";
import * as Layers from "./layers";
import { DiceManager, DieType } from "../dicemanager";
import { AbstractScene } from "./abstractscene";

type IconState = {
    alpha: number,
    angle: number,
    frameOffset: number,
    visible: boolean,
}

export class MainScene extends AbstractScene implements EventListener {

    private pitch: Phaser.GameObjects.Image;
    private homeTeamName: Phaser.GameObjects.Text;
    private awayTeamName: Phaser.GameObjects.Text;

    private pitchScale: number;
    private frameNumber: number;
    private i: Phaser.Input.InputPlugin;
    private dragStart: Phaser.Geom.Point;
    private scale: number;
    private width: number;
    private height: number;
    private moveSquareIcons: Phaser.GameObjects.Sprite[];
    private trackNumberIcons: Phaser.GameObjects.Graphics[];
    private dirty: boolean;
    private ballIcon: Phaser.GameObjects.Graphics;
    private uiCamera;
    private gridSize: number; // Size of a grid square
    private blockDiceKey: string;

    private floatTextQueue: Promise<any>;

    public constructor(controller: Controller) {
        super('mainScene', controller);
        console.log("Main Scene: constructed");
        this.moveSquareIcons = [];
        this.trackNumberIcons = [];

        this.floatTextQueue = Promise.resolve();

        controller.addEventListener(this);
    }

    public handleEvent(event: EventType, data?: any) {
        switch(event) {
            case EventType.ModelChanged:
                this.dirty = true;
                break;
            case EventType.Resizing:
                this.resize();
                break;
            case EventType.Resized:
                this.controller.DiceManager.setScale(this.pitchScale);
                break;
            case EventType.Click:
                if (data.source == "TestButton") {
                    let numDice = Math.floor(Math.random() * 3) + 1;
                    let targets = [];
                    for (let i=0; i<numDice; i++) {
                        targets.push(Math.floor(Math.random()*6+1));
                    }
                    let x = Math.random() * this.width / 2 + this.width/4;
                    let y = Math.random() * this.height / 2 + this.height/4;

                    this.controller.DiceManager.setScale(this.pitchScale);

                    let types:DieType[] = ["d6", "db", "d8"];
                    let type = types[Math.floor(Math.random() * types.length)];

                    if (Math.random() < 0.05 && targets.length == 2) {
                        this.controller.DiceManager.roll("d68", targets, new Coordinate(x, y));
                    } else {
                        this.controller.DiceManager.roll(type, targets, new Coordinate(x, y));
                    }
                } else if (data.source == "TestButton2") {
                }
                break;
            case EventType.ActivePlayerAction:
                let activePlayer = this.controller.Game.getActivePlayer();
                this.floatText(activePlayer, <string>data);
                break;
            case EventType.FloatText:
                this.floatText(data.player, data.text);
                break;
            case EventType.BlockDice:
                if (this.blockDiceKey != null) {
                    this.controller.DiceManager.fadeRoll(this.blockDiceKey);
                }
                this.blockDiceKey = data;
                break;
            case EventType.BlockChoice:
                let choice: number = data.choice;
                if (this.blockDiceKey !== null) {
                    this.controller.DiceManager.displayBlockChoice(this.blockDiceKey, choice);
                    this.blockDiceKey = null;
                }
                break;
        }
    }

    private floatText(player: Model.Player, text: string) {
        this.floatTextQueue = this.floatTextQueue
        .then(() => {
            return new Promise<any>((resolve, reject) => {
                setTimeout(() => { resolve(); }, 333);
                this.executeFloatText(player, text);
            });
        });
    }

    private executeFloatText(player: Model.Player, text: string) {
        if (player == null) {
            return;
        }

        let pos = player.getPosition();
        let [x, y] = this.controller.convertToPixels(pos);
        let t = this.add.text(x, y, text.toUpperCase(), {
            fontSize: (10 * this.pitchScale) + 'px',
            fill: 'white',
            stroke: 'black',
            strokeThickness: 2,

        });
        t.x = t.x - t.width / 2 + 15 * this.pitchScale;
        this.tweens.add({
            targets: t,
            duration: 1000,
            ease: 'Quad.easeIn',
            alpha: 0,
            y: y - 60 * this.pitchScale,
            onComplete: () => {
                t.visible = false;
                t.destroy();
            }
        });
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

        this.pitch = this.add.image(0, 0, 'pitch').setOrigin(0, 0);
        this.frameNumber = 0;

        this.pitchScale = 1.0;

        let game = this.controller.getGameState();

        this.homeTeamName = this.createTeamName(game.teamHome.name);
        this.awayTeamName = this.createTeamName(game.teamAway.name);

        this.homeTeamName.setAngle(270);
        this.awayTeamName.setAngle(90);

        let icons = {};
        for (let i in game.teamAway.roster.positions) {
            let pos = game.teamAway.roster.positions[i];
            icons[pos['id']] = '/'+pos['iconURI'];
        }

        for (let i in game.teamHome.roster.positions) {
            let pos = game.teamHome.roster.positions[i];
            icons[pos['id']] = '/'+pos['iconURI'];
        }

        let awayPlayers = game.teamAway.getPlayers();
        for (let i in awayPlayers) {
            let player = awayPlayers[i];
            player.setTeam(Model.Side.Away);
            player.icon = this.add.sprite(0,0,icons[player.positionId], player.positionIcon * 4 + 2);
            player.icon.setOrigin(0.5,0.5);
            player.icon.visible=false;
        }

        let homePlayers = game.teamHome.getPlayers();
        for (let i in homePlayers) {
            let player = homePlayers[i];
            player.setTeam(Model.Side.Home);
            player.icon = this.add.sprite(0,0,icons[player.positionId], player.positionIcon * 4 + 0);
            player.icon.setOrigin(0.5,0.5);
            player.icon.visible=false;
        }

        if (!this.ballIcon) {
            // Ugly. Needs to be a sprite...
            this.ballIcon = this.add.graphics();
            this.ballIcon.clear();
            this.ballIcon.fillStyle(0xffff00, 1);
            this.ballIcon.fillCircle(0, 0, 5);
        }

        const FAR_AWAY = -10000;

        // Set up UI overlay
        let uiLayer = new Layers.UILayer(this, game, this.controller);

        uiLayer.container.setPosition(FAR_AWAY, FAR_AWAY);
        this.add.existing(uiLayer.container);

        //this.cameras.main.setBounds(0, 0, 0, 0);
        this.cameras.main.setRoundPixels(true);

        let uiCamera = this.cameras.add(0, 0, this.width, this.height);
        uiCamera.setZoom(1);
        uiCamera.setScroll(FAR_AWAY, FAR_AWAY);
        this.uiCamera = uiCamera;

        window.onresize = () => {
            this.controller.triggerEvent(EventType.Resizing);
        };

        this.redraw(this.controller.getGameState());
        this.resize();
    }

    private createTeamName(name: string): Phaser.GameObjects.Text {
        let t = this.add.text(0, 0, name.toUpperCase());
        t.setFontFamily("arial");
        t.setFontSize(this.gridSize * 0.9);
        t.setColor("#ffffff");
        t.setAlpha(0.5);
        t.setOrigin(0.5, 0.5);
        t.setBlendMode(Phaser.BlendModes.OVERLAY);

        return t;
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
        let marginLeft = w * 0;
        let marginRight = w * 0;
        let marginBottom = h * 0;

        w -= marginLeft + marginRight;
        h -= marginTop + marginBottom;

        let zoomFactorX = w / this.pitch.width;
        let zoomFactorY = h / this.pitch.height;
        let zoomFactor = Math.min(zoomFactorX, zoomFactorY);

        this.gridSize = zoomFactor * this.pitch.width/26;

        this.pitch.setScale(zoomFactor);
        this.pitchScale = zoomFactor;
        this.controller.triggerEvent(EventType.ModelChanged);

        // Calculate margins to center field in viewport
        let scrollX = -Math.floor((w - this.pitch.displayWidth) / 2);
        let scrollY = -Math.floor((h - this.pitch.displayHeight) / 2);
        this.cameras.main.setScroll(scrollX, scrollY);

        this.cameras.main.setViewport(marginLeft, marginTop, w, h);
        this.uiCamera.setViewport(0, 0, this.width, this.height);

        this.controller.triggerEvent(EventType.Resized, {
            w: this.sys.canvas.clientWidth,
            h: this.sys.canvas.clientHeight,
            scale: this.gridSize
        });

        this.homeTeamName.setFontSize(this.gridSize * 0.9);
        this.awayTeamName.setFontSize(this.gridSize * 0.9);

        let [x,y] = this.controller.convertToPixels(new Coordinate(0.5, 7.5));
        this.homeTeamName.setPosition(x, y);

        [x,y] = this.controller.convertToPixels(new Coordinate(25.5, 7.5));
        this.awayTeamName.setPosition(x, y);
    }

    public getGridSize(): number {
        return this.gridSize;
    }

    public update() {
        let game = this.controller.getGameState();

        if (this.dirty) {
            this.redraw(this.controller.getGameState());
            this.dirty = false;
        }
    }

    public redraw(game: Model.Game) {
        for (let player of game.getPlayers()) {
            if (player) {
                let iconScale = Math.max(1, Math.floor(this.pitchScale));
                player.icon.setScale(iconScale, iconScale);
                player.icon.setScaleMode(Phaser.ScaleModes.NEAREST);

                let iconState = this.getIconState(player);

                let [pX, pY] = this.controller.convertToPixels(player.coordinate.add(0.5, 0.5));

                player.icon.setFrame(player.getBaseIconFrame() + iconState.frameOffset);
                player.icon.angle = iconState.angle;
                player.icon.setAlpha(iconState.alpha);
                player.icon.visible = iconState.visible;

                player.icon.setPosition(pX, pY);
            }
        }

        this.moveSquareIcons.map((i) => i.visible = false);

        let i=0;
        let squares = game.getMoveSquares();
        for (let index in squares) {
            let coordinate = squares[i]
            let [w, h] = this.controller.convertToPixels(new Coordinate(0.8, 0.8));
            let [x, y] = this.controller.convertToPixels(coordinate.add(0.5, 0.5));
            if (i == this.moveSquareIcons.length) {
                let icon = this.add.sprite(x, y, "moveSquare");
                icon.setOrigin(0.5, 0.5);
                this.moveSquareIcons.push(icon);
            }
            let icon = this.moveSquareIcons[i];
            icon.setDisplaySize(w, h);
            icon.setPosition(x, y);
            icon.visible = true;
            i++;
        }

        this.trackNumberIcons.map((i) => i.visible = false);
        i=0;
        squares = game.getTrackNumbers();
        for (let index in squares) {
            let coordinate = squares[i]
            if (i == this.trackNumberIcons.length) {
                let icon = this.add.graphics();
                icon.clear();
                icon.fillStyle(0xff9F00, 1);
                icon.fillCircle(0, 0, 5);
                this.trackNumberIcons.push(icon);
            }
            let icon = this.trackNumberIcons[i];

            let [pX,pY] = this.controller.convertToPixels(coordinate.add(0.5, 0.5));

            icon.setPosition(pX, pY);
            icon.visible = true;
            i++;
        }

        let ballCoordinate = game.getBallCoordinate();

        if (ballCoordinate) {
            let [pX,pY] = this.controller.convertToPixels(ballCoordinate.add(0.8, 0.8));

            this.ballIcon.setPosition(pX, pY);
            this.ballIcon.visible = true;
        } else {
            this.ballIcon.visible = false;
        }
    }

    private getIconState(player: Model.Player): IconState {
        let result: IconState = {
            alpha: 0,
            angle: 0,
            frameOffset: 0,
            visible: false
        };

        switch(player.getState()) {
            case Model.PlayerState.Prone:
                result.angle = -90;
                result.frameOffset = 1;
                break;
            case Model.PlayerState.Stunned:
                result.angle = 90;
                result.frameOffset = 1;
                break;
            case Model.PlayerState.Moving:
                result.angle = 0;
                result.frameOffset = 1;
                break;
            case Model.PlayerState.Falling:
                result.angle = 90;
                result.frameOffset = 0;
                break;
            default:
                result.angle = 0;
                result.frameOffset = 0;
                break;
        }

        let flags = player.getFlags();

        if (flags & Model.PlayerState._bit_active) {
            result.alpha = 1;
        } else {
            result.alpha = 0.5;
        }

        if (player.getTeam() == Model.Side.Away) {
            result.angle = -result.angle;
        }

        result.visible = player.isOnField();

        return result;
    }
}
