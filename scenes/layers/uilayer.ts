import Phaser from "phaser";
import * as Comp from "../components";
import { EventListener, EventType } from "../../types/eventlistener";
import * as Model from "../../model";
import Controller from "../../controller";

export class UILayer implements EventListener {
    public container: Phaser.GameObjects.Container;
    private scene: Phaser.Scene;
    private scale: number;
    private labelHomeScore: Comp.Label;
    private labelAwayScore: Comp.Label;
    private labelHalf: Comp.Label;
    private labelTurn: Comp.Label;
    private controller: Controller;

    private component: Comp.UIComponent;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Controller) {
        this.controller = controller;
        this.scene = scene;
        this.container = scene.make.container({});
        controller.addEventListener(this);

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
            margin:  {
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
            margin:  {
                left: 1.5,
            },
            height: 1,
            anchor: Comp.Anchor.WEST,
            parentAnchor: Comp.Anchor.CENTER,
            color: 0xffffff,
            text: "T0/0",
        });

        this.component = new Comp.Panel({
            id: "RootPanel",
            width: "100%",
            height: "100%",
            children: [
                new Comp.Panel({
                    id: "TopBar",
                    width: "100%",
                    height: 1,
                    anchor: Comp.Anchor.NORTH,
                    parentAnchor: Comp.Anchor.NORTH,
                    background: 0x003300,
                    children: [
                        new Comp.Panel({
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
                        }),
                    ]
                }),
                new Comp.Button({
                    id: "DebugButton",
                    width: 0.9,
                    height: 0.9,
                    anchor: Comp.Anchor.SOUTHWEST,
                    parentAnchor: Comp.Anchor.SOUTHWEST,
                    background: 0x999999,
                }, controller),
                new Comp.Button({
                    id: "TestButton",
                    width: 0.9,
                    height: 0.9,
                    margin: {
                        bottom: 1.1,
                    },
                    anchor: Comp.Anchor.SOUTHWEST,
                    parentAnchor: Comp.Anchor.SOUTHWEST,
                    background: 0x999999,
                }, controller),
                new Comp.Button({
                    id: "TestButton2",
                    width: 0.9,
                    height: 0.9,
                    margin: {
                        bottom: 2.2,
                    },
                    anchor: Comp.Anchor.SOUTHWEST,
                    parentAnchor: Comp.Anchor.SOUTHWEST,
                    background: 0x999999,
                }, controller),
            ]
        });
    }

    public handleEvent(eventType: EventType, data?: any) {
        if (eventType == EventType.Resized) {
            this.scale = data.scale;
            this.redraw(data.w, data.h);
        }
        if (eventType == EventType.ModelChanged) {
            let g = this.controller.Game;
            this.labelHomeScore.setText(g.teamHome.getScore().toString());
            this.labelAwayScore.setText(g.teamAway.getScore().toString());

            let half = "H"+g.getHalf();
            let turn = "T"+g.teamHome.getTurn()+"/"+g.teamAway.getTurn();
            this.labelHalf.setText(half);
            this.labelTurn.setText(turn);
        }
    }

    public redraw(w: number, h: number) {
        let g = this.component.render({
            scene: this.scene,
            parent: null,
            w: w,
            h: h,
            scale: this.scale,
            x: 0,
            y: 0,
        });
        this.container.add(g);
    }
}
