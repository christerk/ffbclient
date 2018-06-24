import Phaser from "phaser";
import CommandHandler from "../commandhandler";
import Game from "../model/game";

export default class MainScene extends Phaser.Scene {

    private pitch: Phaser.GameObjects.Image;
    private pitchScale: number;
    private frameNumber: number;
    private cursors: CursorKeys;
    private i: Phaser.Input.InputPlugin;
    private dragStart: number[];
    private scale: number;
    private width: number;
    private height: number;
    private controller: any;

    public constructor(controller: any) {
        super({
            key: 'mainScene'
        });
        console.log("Main Scene: constructed");
        this.controller = controller;
    }

    public init(config) {
        console.log('Main Scene: init', config);

        this.controller.scene = this.scene;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.scale = 1.0;

        this.width = this.sys.canvas.width;
        this.height = this.sys.canvas.height;
    }

    public preload() {
        console.log('Main Scene: preload');
    
    }

    public create(config) {
        console.log('Main Scene: create', config);

        this.pitch = this.add.image(0, 0, 'pitch').setOrigin(0,0);
        this.frameNumber = 0;

        this.pitchScale = this.width / this.pitch.width;
        this.pitch.setScale(this.pitchScale);

        this.pitch.setInteractive();
        this.input.setDraggable(this.pitch);
        
        this.input.on('dragstart', (pointer, gameObject) => {
            this.dragStart = [this.cameras.main.scrollX, this.cameras.main.scrollY];
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            let scaling = this.cameras.main.zoom;
            let sX = this.dragStart[0]-dragX / scaling;
            let sY = this.dragStart[1]-dragY / scaling;

            this.cameras.main.setScroll(sX, sY);
        });

        let game = this.controller.getGameState();

        let icons = {};
        for (let i in game.teamAway.roster.positions) {
            let pos = game.teamAway.roster.positions[i];
            icons[pos['id']] = '/'+pos['iconURI'];
        }

        for (let i in game.teamHome.roster.positions) {
            let pos = game.teamHome.roster.positions[i];
            icons[pos['id']] = '/'+pos['iconURI'];
        }

        console.log(icons);

        for (let i in game.teamAway.players) {
            let player = game.teamAway.players[i];
            player.icon = this.add.sprite(0,0,icons[player.positionId], 2);
            player.icon.setOrigin(0,0);
            player.icon.visible=false;
        }

        for (let i in game.teamHome.players) {
            let player = game.teamHome.players[i];
            player.icon = this.add.sprite(0,0,icons[player.positionId], 0);
            player.icon.setOrigin(0,0);
            player.icon.visible=false;
        }

        this.redraw(this.controller.getGameState());    

        this.cameras.main.setBounds(0, 0, 0, 0);
    }

    public update() {
        let game = this.controller.getGameState();

        if (game.dirty) {
            this.redraw(this.controller.getGameState());
            game.dirty = false;
        }

        if (this.cursors.shift.isDown) {
            if (this.cursors.up.isDown) {
                this.scale = this.scale + 0.5;

            } else if (this.cursors.down.isDown) {
                this.scale = 1.0;
            }

            let scale = this.scale;
            this.cameras.main.setZoom(scale);
            this.cameras.main.setBounds(-this.width * ((scale-1)/(scale*2)), -this.height * ((scale-1)/(scale*2)), this.width * (2-1/scale), this.height * (2-1/scale));
        } else {
            if (this.cursors.up.isDown) {
                this.cameras.main.scrollY--;
            } else if (this.cursors.left.isDown) {
                this.cameras.main.scrollX--;
            } else if (this.cursors.down.isDown) {
                this.cameras.main.scrollY++;
            } else if (this.cursors.right.isDown) {
                this.cameras.main.scrollX++;
            }
        }
    }

    public redraw(game: Game) {
        for (let player of game.getPlayers()) {
            if (player) {
                let [x, y] = player.coordinate;
                if (x >= 0 && x <= 25) {
                    player.icon.visible = true;
                    let pX = this.pitchScale * (15 + x * 30) - player.icon.width / 2;
                    let pY = this.pitchScale * (15 + y * 30) - player.icon.height / 2;
                    player.icon.setPosition(pX, pY);
                } else {
                    player.icon.visible = false;
                }
            }
        }
    }
}
