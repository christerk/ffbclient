import * as Comp from "."
import {EventType} from "../../types";


export class MenuPanelConfiguration {
    orientation: Orientation;
    elements: (MenuEntryConfiguration | MenuNodeConfiguration)[]
}

export class MenuNodeConfiguration {
    id: string;
    orientation: Orientation;
    label: string;
    panel: MenuPanelConfiguration;
}

export class MenuEntryConfiguration {
    public constructor(id: string, label: string, event: EventType){
        this.label = label;
        this.id = id;
        this.event = event;
    }

    label: string;
    id: string;
    event: EventType;
}

export enum Orientation {
    Vertical, Horizontal
}


export class Menu extends Comp.HorizontalPanel {
    private tabs: Comp.Panel[] = [];

    public constructor(config: Comp.ComponentConfiguration) {
        super(config);

        this.tabs.push(new Comp.VerticalPanel({
            id: 'gameMenuSlot',
            visible: true,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            background: 0x0000FF,
            adjustSize: true,
            children: [
                new Comp.Label({
                    id: 'gameMenu',
                    text: 'Game',
                    visible: true,
                    height: 1,
                    anchor: Comp.Anchor.NORTHWEST,
                    parentAnchor: Comp.Anchor.NORTHWEST,
                    adjustSize: true,

                }),
                new Comp.Label({
                    id: 'quitButton',
                    text: 'Quit',
                    height: 1,
                    anchor: Comp.Anchor.NORTHWEST,
                    parentAnchor: Comp.Anchor.NORTHWEST,
                    visible: true,
                    adjustSize: true,
                })
            ]
        }));

        this.tabs.push(new Comp.VerticalPanel({
            id: 'viewMenuSlot',
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: true,
            background: 0xFF0000,
            adjustSize: true,
            children: [
                new Comp.Label({
                    id: 'viewMenu',
                    text: 'View',
                    anchor: Comp.Anchor.NORTHWEST,
                    parentAnchor: Comp.Anchor.NORTHWEST,
                    visible: true,
                    adjustSize: true,

                })
            ]
        }));

        for (let tab of this.tabs) {
            this.addChild(tab);
        }
    }

    public destroy(): void {
        while (this.tabs.length > 0) {
            this.tabs.pop().destroy();
        }
    }

    public show(): void {
        for (let tab of this.tabs) {
            tab.setVisible(true);
        }

    }

    public hide(): void {
        for (let tab of this.tabs) {
            tab.setVisible(false);
        }
    }
}