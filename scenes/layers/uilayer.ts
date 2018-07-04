import Phaser from "phaser";
import * as Comp from "../components";
import { EventListener, EventType } from "../../types/eventlistener";
import * as Model from "../../model";
import Controller from "../../controller";

export class UILayer implements EventListener {
    public container: Phaser.GameObjects.Container;
    private scene: Phaser.Scene;
    private scale: number;

    private component: Comp.UIComponent;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Controller) {
        this.scene = scene;
        this.container = scene.make.container({});
        controller.addEventListener(this);

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
                        new Comp.Label({
                            id: "HomeTeam",
                            margin: {
                                left: 0.5,
                            },
                            height: 1,
                            anchor: Comp.Anchor.WEST,
                            parentAnchor: Comp.Anchor.WEST,
                            color: 0xffffff,
                            text: game.teamHome.name,
                        }),
                        new Comp.Label({
                            id: "AwayTeam",
                            margin: {
                                right: 0.5,
                            },
                            height: 1,
                            anchor: Comp.Anchor.EAST,
                            parentAnchor: Comp.Anchor.EAST,
                            color: 0xffffff,
                            text: game.teamAway.name,
                        }),
                        new Comp.Panel({
                            id: "ScorePanel",
                            width: 4,
                            height: 1,
                            background: 0x003300,
                            children: [
                                new Comp.Label({
                                    id: "HomeScore",
                                    margin: {
                                        right: 0.5,
                                    },
                                    height: 1,
                                    anchor: Comp.Anchor.EAST,
                                    parentAnchor: Comp.Anchor.CENTER,
                                    color: 0xffffff,
                                    text: "0"
                                }),
                                new Comp.Label({
                                    id: "ScoreDash",
                                    height: 1,
                                    anchor: Comp.Anchor.CENTER,
                                    parentAnchor: Comp.Anchor.CENTER,
                                    color: 0xffffff,
                                    text: "-"
                                }),
                                new Comp.Label({
                                    id: "AwayScore",
                                    margin: {
                                        left: 0.5,
                                    },
                                    height: 1,
                                    anchor: Comp.Anchor.WEST,
                                    parentAnchor: Comp.Anchor.CENTER,
                                    color: 0xffffff,
                                    text: "0"
                                }),
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
            ]
        });
    }

    public handleEvent(eventType: EventType, data?: any) {
        if (eventType == EventType.Resized) {
            this.scale = data.scale;
            this.redraw(data.w, data.h);
        }
    }

    public redraw(w: number, h: number) {
        console.log("uilayer redraw()", w, h);
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
