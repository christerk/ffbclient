import * as Comp from "."

export class Menu extends Comp.UIComponent {
    private menu: Phaser.GameObjects.Container;
    private tab1: Phaser.GameObjects.Image;
    private tab2: Phaser.GameObjects.Image;
    
    public constructor(config: Comp.ComponentConfiguration) {
        super(config);
    }

    public create(): Phaser.GameObjects.GameObject {
        this.menu = this.ctx.scene.make.container({})
        let graphics1: Phaser.GameObjects.Graphics = this.ctx.scene.make.graphics({})
        graphics1.fillStyle(0xFF0000, 1)
        graphics1.fillRect(0,0,100, 100)

        let key1 = 'ui:menu:gameMenu';
        let bounds: Phaser.Geom.Rectangle = this.getBounds(this.ctx);
        graphics1.generateTexture(key1, bounds.width/2, bounds.height);
        

        let graphics2: Phaser.GameObjects.Graphics = this.ctx.scene.make.graphics({})
        graphics2.fillStyle(0x0000FF, 1)
        graphics2.fillRect(0,0,100, 100)

        let key2 = 'ui:menu:viewMenu';
        graphics2.generateTexture(key2, bounds.width/2, bounds.height);

        this.tab1 = new Phaser.GameObjects.Image(this.ctx.scene, 0,0,key1)
        this.tab2 = new Phaser.GameObjects.Image(this.ctx.scene, 0,0,key2)

        this.menu.add(this.tab1);
        this.menu.add(this.tab2);

        return this.menu;
    }

    public destroy(): void {
        this.menu.destroy;
    }

    public show(): void {
       this.menu.visible = true;
    }
    public hide(): void {
        this.menu.visible = false;
    }

    public redraw(): void {
        super.redraw();
        let bounds = this.getBounds(this.ctx);
        this.tab1.setPosition(0,0);
        this.tab2.setPosition(bounds.width/2,0);
        this.menu.setPosition(bounds.x, bounds.y);
        this.menu.setDisplaySize(bounds.width, bounds.height);
    }
}