import * as Comp from "."

export class Menu extends Comp.Panel {
    private tabs: Comp.Panel[] = [];

    public constructor(config: Comp.ComponentConfiguration) {
        super({...config, layout: Comp.Layout.HorizontalList});

        this.tabs.push(new Comp.Panel({
            id: 'gameMenuSlot',
            visible: true,
            layout: Comp.Layout.VerticalList,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            background: 0x0000FF,
            children: [
                new Comp.Label({
                    id: 'gameMenu',
                    text: 'Game',
                    visible: true,
                    anchor: Comp.Anchor.NORTHWEST,
                    parentAnchor: Comp.Anchor.NORTHWEST,

                })/*,
                new Comp.Label({
                    id: 'quitButton',
                    text: 'Quit',
                    visible: true
                })*/
            ]
        }));

        this.tabs.push(new Comp.Panel({
            id: 'viewMenuSlot',
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: true,
            layout: Comp.Layout.VerticalList,
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