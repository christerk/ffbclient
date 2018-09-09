import * as Comp from "."

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
            children: [
                new Comp.Label({
                    id: 'gameMenu',
                    text: 'Game',
                    visible: true,
                    height: 1,
                    anchor: Comp.Anchor.NORTHWEST,
                    parentAnchor: Comp.Anchor.NORTHWEST,

                }),
                new Comp.Label({
                    id: 'quitButton',
                    text: 'Quit',
                    height: 1,
                    anchor: Comp.Anchor.NORTHWEST,
                    parentAnchor: Comp.Anchor.NORTHWEST,
                    visible: true
                })
            ]
        }));

        this.tabs.push(new Comp.Panel({
            id: 'viewMenuSlot',
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: true,
            background: 0xFF0000,
            children: [
                new Comp.Label({
                    id: 'viewMenu',
                    text: 'View',
                    anchor: Comp.Anchor.NORTHWEST,
                    parentAnchor: Comp.Anchor.NORTHWEST,
                    visible: true,

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