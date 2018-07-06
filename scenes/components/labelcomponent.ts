import * as Comp from ".";

export class Label extends Comp.UIComponent {
    private text: string;

    public constructor(config) {
        super(config);

        this.text = config.text;
    }

    public render(ctx: Comp.RenderContext): Phaser.GameObjects.GameObject {
        this.config.width = 0;
        let col = this.numberToRGBString(this.config.color);
        let bg = this.numberToRGBString(this.config.background);
        let bounds = this.getBounds(ctx);
        let g = ctx.scene.make.text({});
        g.setFontFamily("arial");
        g.setFontSize(bounds.height * 0.9);
        g.setColor(col);
        g.setText(this.text);
        g.setBackgroundColor(bg);

        this.config.width = g.displayWidth + "px";
        bounds = this.getBounds(ctx);

        g.setPosition(bounds.x, bounds.y);

        return g;
    }    
}
