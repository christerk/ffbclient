import * as Comp from "."

export class Menu extends Comp.Panel {
    private tabs: Comp.Label[] = []
    
    public constructor(config: Comp.ComponentConfiguration) {
        super(config);

        this.tabs.push(new Comp.Label({
            id: 'gameMenu',
            text: 'Game',
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: true
        }))

        this.tabs.push(new Comp.Label({
            id: 'viewMenu',
            text: 'View',
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: true
        }))

        let self = this;

        this.tabs.forEach( function(tab){
            self.addChild(tab);
        });
    }

    public create(): Phaser.GameObjects.GameObject {
        return super.create();
    }

    public destroy(): void {
        while (this.tabs.length > 0) {
            this.tabs.pop().destroy();
        }
    }

    public show(): void {
        this.tabs.forEach( function(tab){
            tab.setVisible(true);
        });
        
    }
    public hide(): void {
        this.tabs.forEach( function(tab){
            tab.setVisible(false);
        });
    }

    public redraw(): void {
        super.redraw();
        let context = this.ctx
        let bounds = this.getBounds(context);
        let offSet: number = bounds.x;

        this.tabs.forEach( function(tab){
            console.log("offset is :" + offSet);
            tab.setPosition(offSet, bounds.y);
            tab.redraw();
            offSet += tab.getBounds(context).width
        });
    }
}