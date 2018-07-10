import * as Comp from ".";

export class Label extends Comp.UIComponent {
    private text: string;
    private textObject: Phaser.GameObjects.Text;

    public constructor(config) {
        super(config);

        this.text = config.text;
    }

    public create(): Phaser.GameObjects.GameObject {
        this.textObject = this.ctx.scene.make.text({});
        this.textObject.setFontFamily("arial");

        return this.textObject;
    }

    public show() {
        this.textObject.visible = true;
    }

    public hide() {
        this.textObject.visible = false;
    }

    public redraw(): void {
        super.redraw();
        
        this.config.width = 0;
        let col = this.numberToRGBString(this.config.color);
        let bg = this.numberToRGBString(this.config.background);
        let bounds = this.getBounds(this.ctx);
        let g = this.textObject;
        g.setFontSize(bounds.height * 0.9);
        g.setColor(col);
        g.setText(this.text);
        g.setBackgroundColor(bg);

        this.config.width = g.displayWidth + "px";
        bounds = this.getBounds(this.ctx);

        g.setPosition(bounds.x, bounds.y);
    }

    public setText(text: string) {
        this.text = text;

        let g = this.textObject;
        if (g) {
            g.setText(text);
            this.config.width = g.displayWidth + "px";
            let bounds = this.getBounds(this.ctx);
            g.setPosition(bounds.x, bounds.y);
        }
    }
}
