import * as Comp from ".";

export class Label extends Comp.UIComponent {
    private text: string;

    public constructor(config) {
        super(config);

        this.text = config.text;
    }

    public render(parent: Phaser.Scene, w: number, h: number): Phaser.GameObjects.GameObject {
        this.bounds.width = 0;
        let bounds = this.getBounds(w, h);
        let g = parent.make.text({
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        g.setFontSize(bounds.height);
        g.setText(this.text);

        this.bounds.width = g.displayWidth / w;
        bounds = this.getBounds(w, h);
        g.setPosition(bounds.x, bounds.y);

        this.graphic = g;

        return g;
    }    
}
