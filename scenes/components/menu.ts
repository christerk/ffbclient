import * as Comp from "."

export class Menu extends Comp.Panel {
    private tabs: Comp.Label[] = []
    
    public constructor(config: Comp.ComponentConfiguration) {
        super({...config, layout: Comp.Layout.HorizontalList});

        this.tabs.push(new Comp.Label({
            id: 'gameMenu',
            text: 'Game',
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: true
        }));

        this.tabs.push(new Comp.Label({
            id: 'viewMenu',
            text: 'View',
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: true
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