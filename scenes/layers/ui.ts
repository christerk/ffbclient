import Phaser from "phaser";
import * as Core from "../../core";
import * as Comp from "../components";
import * as Types from "../../types";
import * as Model from "../../model";
import {MenuEntryConfiguration, MenuPanelConfiguration, Orientation} from "../components";
import {EventType} from "../../types";
import {MenuBuilder} from "../components/menu/menubuilder";

export class UI implements Types.EventListener {
    public container: Phaser.GameObjects.Container;
    private scene: Phaser.Scene;
    private scale: number;
    private labelHomeScore: Comp.Label;
    private labelAwayScore: Comp.Label;
    private labelHalf: Comp.Label;
    private labelTurn: Comp.Label;
    private input: Comp.Input;
    private controller: Core.Controller;
    private playerCard: Comp.PlayerCard;

    private debugText: Comp.Label;

    private component: Comp.BorderPanel;

    private renderContext: Comp.RenderContext;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        this.controller = controller;
        this.scene = scene;
        this.container = scene.make.container({});
        controller.addEventListener(this);

        let menuConfig: MenuPanelConfiguration = {
            orientation: Orientation.Horizontal,
            elements: [
                {
                    id: 'gameMenu',
                    orientation: Orientation.Vertical,
                    label: 'Game',
                    panel: {
                        orientation: Orientation.Vertical,
                        elements: [{
                            label: 'Quit',
                            id: 'quitButton',
                            event: EventType.Quit
                        }]

                    }
                }, {
                    id: 'viewMenu',
                    orientation: Orientation.Vertical,
                    label: 'View',
                    panel: {
                        orientation: Orientation.Vertical,
                        elements: [{
                            label: 'Fullscreen',
                            id: 'fullscreenButton',
                            event: EventType.FullScreen
                        },{
                            label: 'Toggle Dugouts',
                            id: 'toggleDugouts',
                            event: EventType.ToggleDugouts
                        }]
                    }
                }]
        };

        this.labelHomeScore = new Comp.Label({
            id: "HomeScore",
            margin: {
                right: 0.5,
            },
            height: 1,
            anchor: Comp.Anchor.EAST,
            parentAnchor: Comp.Anchor.CENTER,
            color: 0xffffff,
            text: "0"
        });

        this.labelAwayScore = new Comp.Label({
            id: "AwayScore",
            margin: {
                left: 0.5,
            },
            height: 1,
            anchor: Comp.Anchor.WEST,
            parentAnchor: Comp.Anchor.CENTER,
            color: 0xffffff,
            text: "0"
        });

        this.labelHalf = new Comp.Label({
            id: "Half",
            margin: {
                right: 1.5,
            },
            height: 1,
            anchor: Comp.Anchor.EAST,
            parentAnchor: Comp.Anchor.CENTER,
            color: 0xffffff,
            text: "H0",
        });

        this.labelTurn = new Comp.Label({
            id: "Turn",
            margin: {
                left: 1.5,
            },
            height: 1,
            anchor: Comp.Anchor.WEST,
            parentAnchor: Comp.Anchor.CENTER,
            color: 0xffffff,
            text: "T0/0",
        });

        this.input = new Comp.Input({
            id: "Input",
            width: "80%",
            height: "0.8",
            anchor: Comp.Anchor.SOUTH,
            parentAnchor: Comp.Anchor.SOUTH,
            background: 0x0,
            backgroundAlpha: 0.4,
            margin: {
                bottom: 0.2
            },
            visible: false,
            inheritVisibility: false,
        });

        this.input.setCallback((text) => {
            controller.sendChat(text);
        });

        this.playerCard = new Comp.PlayerCard({
            id: "PlayerCard",
            width: 3,
            height: 4,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            background: 0xc91321,
            visible: false,
            inheritVisibility: false,
        });

        this.debugText = new Comp.Label({
            id: "DebugText",
            height: 0.5,
            anchor: Comp.Anchor.NORTHEAST,
            parentAnchor: Comp.Anchor.NORTHEAST,
            color: 0xffffff,
            text: "",
        });

        this.component = new Comp.BorderPanel({
            id: "RootPanel",
            width: "100%",
            height: "100%",
            children: [
                new Comp.BorderPanel({
                    id: "TopBar",
                    width: "100%",
                    height: 1,
                    anchor: Comp.Anchor.NORTH,
                    parentAnchor: Comp.Anchor.NORTH,
                    background: 0x003300,
                    children: [
                        this.debugText,
                        new Comp.BorderPanel({
                            id: "ScorePanel",
                            width: 6,
                            height: 1,
                            background: 0x003300,
                            children: [
                                this.labelHalf,
                                this.labelHomeScore,
                                new Comp.Label({
                                    id: "ScoreDash",
                                    height: 1,
                                    anchor: Comp.Anchor.CENTER,
                                    parentAnchor: Comp.Anchor.CENTER,
                                    color: 0xffffff,
                                    text: "-"
                                }),
                                this.labelAwayScore,
                                this.labelTurn
                            ]
                        })
                    ]
                }),

                this.input,
                this.playerCard,
            ]
        });

        this.renderContext = {
            scene: this.scene,
            parent: null,
            w: this.scene.sys.canvas.clientWidth,
            h: this.scene.sys.canvas.clientHeight,
            scale: 30,
            x: 0,
            y: 0,
            offset: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }

        };

        let menu = new MenuBuilder(this.controller).build(menuConfig, 'TopBar');
        this.component.addChild(menu);
        this.component.setContext(this.renderContext);
        let phaserObject = this.component.create();
        this.component.postCreate();
        this.container.add(phaserObject);
    }

    public setDebugText(text: string) {
        this.debugText.setText(text);
    }

    public setPlayerCard(player: Model.Player, pos?: number[], sz?: number[]) {
        if (player == null) {
            this.playerCard.setVisible(false);
        } else {
            this.playerCard.setPosition(pos[0], pos[1]);
            this.playerCard.setSize(sz[0], sz[1]);
            this.playerCard.setVisible(true);
            this.playerCard.setPlayer(player);
            this.playerCard.redraw();
        }
    }

    public handleEvent(eventType: Types.EventType, data?: any) {
        if (eventType == Types.EventType.Resized) {
            this.renderContext.w = data.w;
            this.renderContext.h = data.h;
            this.renderContext.scale = data.scale;
            this.redraw();
        }
        if (eventType == Types.EventType.ModelChanged) {
            let g = this.controller.Game;
            this.labelHomeScore.setText(g.teamHome.getScore().toString());
            this.labelAwayScore.setText(g.teamAway.getScore().toString());

            let half = "H" + g.getHalf();
            let turn = "T" + g.teamHome.getTurn() + "/" + g.teamAway.getTurn();
            this.labelHalf.setText(half);
            this.labelTurn.setText(turn);
        }
    }

    public redraw() {
        this.component.setContext(this.renderContext);
        this.component.redraw();
    }
}
