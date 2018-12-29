import * as Comp from ".";

export class Input extends Comp.UIComponent {
    private container: Phaser.GameObjects.Container;
    private background: Phaser.GameObjects.Image;
    private textObject: Phaser.GameObjects.Text;
    private caret: Phaser.GameObjects.Sprite;
    private text: string;
    private caretPosition: number;
    private callbackFunction: (string) => void;

    public constructor(config) {
        super(config);

        this.background = null;
        this.text = "";
        this.caretPosition = 0;
    }

    public setCallback(callbackFunction: (string) => void) {
        this.callbackFunction = callbackFunction;
    }

    public create(): Phaser.GameObjects.GameObject {
        let col = this.numberToRGBString(this.config.color);
        let bounds = this.getBounds();

        let bg = this.ctx.scene.make.graphics({});
        bg.clear();
        bg.fillStyle(this.config.background, this.config.backgroundAlpha);
        bg.fillRect(0, 0, bounds.width, bounds.height);
        let bgKey = Comp.UIComponent.generateKey();
        bg.generateTexture(bgKey, bounds.width, bounds.height);

        let g = this.ctx.scene.make.text({});
        g.setFontFamily("arial");
        g.setFontSize(bounds.height * 0.8);
        g.setColor(col);
        g.setText(this.text);

        let caret = this.ctx.scene.make.graphics({});
        let caretWidth = Math.floor(this.ctx.scale / 10);
        caret.clear();
        caret.fillStyle(0x999999, 0.8);
        caret.fillRect(0, 0, caretWidth, bounds.height);
        let caretKey = Comp.UIComponent.generateKey();
        caret.generateTexture(caretKey, 2*caretWidth, bounds.height);
        this.caret = new Phaser.GameObjects.Sprite(this.ctx.scene, 0, 0, caretKey, 0);
        this.caret.texture.add("on", 0, 0, 0, caretWidth, bounds.height);
        this.caret.texture.add("off", 0, caretWidth, 0, caretWidth, bounds.height);
        this.caret.frame.width = caretWidth;
        this.caret.frame.height = bounds.height;

        this.caret.setOrigin(0.5,0);
        let animKey = Comp.UIComponent.generateKey();
        let anim = this.ctx.scene.anims.create({
            key: animKey,
            frames: [{key: caretKey, frame: "on"}, {key: caretKey, frame: "off"}],
            frameRate: 2,
            repeat: -1,
        });

        this.ctx.scene.add.existing(this.caret);
        this.caret.play(animKey);

        if (this.config.background != null) {
            this.background = new Phaser.GameObjects.Image(this.ctx.scene, 0, 0, bgKey);
            this.background.setOrigin(0, 0);
        }

        this.textObject = g;

        this.container = this.ctx.scene.make.container({});

        this.container.add([this.background, this.textObject, this.caret]);

        //this.ctx.scene.input.keyboard.addListener("keydown", (event) => {
        window.onkeydown = (event) => {
            console.log(event);
            if (this.config.visible) {
                this.onKeydown(event);
                event.preventDefault();
                return false;
            } else if (event.key == "Enter") {
                this.setVisible(true);
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", (event) => {
            if (this.config.visible) {
                event.preventDefault();
            }
        })

        return this.container;
    }

    public destroy(): void {
        this.caret.destroy();
        this.textObject.destroy();
        this.background.destroy();
        this.container.destroy();
    }

    public show() {
        if (this.background != null) {
            this.background.visible = true;
        }
        this.textObject.visible = true;
        this.caret.visible = true;
    }

    public hide() {
        if (this.background != null) {
            this.background.visible = false;
        }
        this.textObject.visible = false;
        this.caret.visible = false;
    }

    private onKeydown(event) {
        let key = event.key;
        if (key.length == 1) {
            this.setText(this.pre() + key + this.post());
            this.caretPosition++;
            this.redraw();
        } else {
            if (event.key == "ArrowLeft") {
                if (this.caretPosition > 0) {
                    this.caretPosition--;
                    this.redraw();
                }
            } else if (event.key == "ArrowRight") {
                if (this.caretPosition < this.text.length) {
                    this.caretPosition++;
                    this.redraw();
                }
            } else if (event.key == "Enter") {
                if (this.callbackFunction) {
                    this.callbackFunction(this.text);
                }
                this.setText("");
                this.caretPosition = 0;
                this.setVisible(false);
            } else if (event.key == "Escape") {
                this.setText("");
                this.caretPosition = 0;
                this.setVisible(false);
                this.redraw();
            } else if (event.key == "Backspace") {
                let pre = this.pre();
                let post = this.post();
                if (pre.length > 0) {
                    pre = pre.substr(0, pre.length-1);
                    this.caretPosition--;
                }
                this.setText(pre + post);
                this.redraw();
            } else if (event.key == "Delete") {
                let post = this.post();
                if (post.length > 0) {
                    post = post.substr(1)
                }
                this.setText(this.pre() + post);
                this.redraw();
            } else if (event.key == "End") {
                this.caretPosition = this.text.length;
                this.redraw();
            } else if (event.key == "Home") {
                this.caretPosition = 0;
                this.redraw();
            }
        }
    }

    private pre(): string {
        return this.text.substr(0, this.caretPosition);
    }

    private post(): string {
        return this.text.substr(this.caretPosition);
    }

    public redrawSelfBeforeChildren(): void {
        super.redrawSelfBeforeChildren();

        let bounds = this.getBounds();

        let caretSize = Math.floor(this.ctx.scale / 10);

        this.textObject.setPosition(bounds.x + caretSize, bounds.y);
        this.textObject.setFontSize(bounds.height * 0.8);

        this.caret.setDisplaySize(caretSize, bounds.height);

        this.textObject.setText(this.text.substr(0, this.caretPosition));
        let caretX = this.textObject.displayWidth;
        this.textObject.setText(this.text);

        this.caret.setPosition(bounds.x + caretX + caretSize, bounds.y);

        if (this.background != null) {
            this.background.setPosition(bounds.x, bounds.y);
            this.background.setDisplaySize(bounds.width, bounds.height);
        }
    }

    public setText(text: string) {
        this.text = text;

        let g = this.textObject;
        if (g) {
            g.setText(text);
        }
    }
}
