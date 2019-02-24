import Phaser from "phaser";
import * as Core from "../../core";
import * as Model from "../../model";
import * as Layers from ".";

export class Player extends Layers.Abstract {
    private readonly container: Phaser.GameObjects.Container;

    public constructor(scene: Phaser.Scene, game: Model.Game, controller: Core.Controller) {
        super(scene, game, controller);
        this.container = scene.make.container({});
    }

    public getView(): Phaser.GameObjects.GameObject {
        return this.container;
    }

    public create() {

        let home = this.game.teamHome;
        let away = this.game.teamAway;

        let icons = {};
        let positions = away.getRoster().getPositions();
        for (let i in positions) {
            let pos = positions[i];
            icons[pos['id']] = '/'+pos['iconURI'];
        }

        positions = home.getRoster().getPositions();
        for (let i in positions) {
            let pos = positions[i];
            icons[pos['id']] = '/'+pos['iconURI'];
        }

        let awayPlayers = away.getPlayers();
        for (let i in awayPlayers) {
            let player = awayPlayers[i];
            player.setTeam(Model.Side.Away);
            player.icon = this.createPlayerIcon(player, icons, 2);
            this.container.add(player.icon);
        }

        let homePlayers = home.getPlayers();
        for (let i in homePlayers) {
            let player = homePlayers[i];
            player.setTeam(Model.Side.Home);
            player.icon = this.createPlayerIcon(player, icons, 0);
            this.container.add(player.icon);
        }
    }

    private createPlayerIcon(player: Model.Player, icons: {}, positionIconOffest: number): Phaser.GameObjects.Sprite {
        let icon = new Phaser.GameObjects.Sprite(this.scene, 0,0, icons[player.positionId], player.positionIcon * 4 + positionIconOffest);
        icon.setOrigin(0.5,0.5);
        icon.visible=false;
        return icon;
    }

    public redraw() {
        for (let player of this.game.getPlayers()) {
            if (player) {
                let iconState = player.getIconState();

                let [pX, pY] = this.controller.convertToPixels(player.coordinate.add(0.5, 0.5));

                player.icon.setFrame(player.getBaseIconFrame() + iconState.frameOffset);
                player.icon.angle = iconState.angle;
                player.icon.setAlpha(iconState.alpha);
                player.icon.visible = iconState.visible;
                player.icon.setPosition(pX, pY);
            }
        }
    }

    public resize(scale: number, gridSize: number) {
        super.resize(scale, gridSize);
        
        let iconScale = Math.max(1, Math.floor(scale));
        for (let player of this.game.getPlayers()) {
            if (player) {
                player.icon.setScale(iconScale);
                player.icon.setScaleMode(Phaser.ScaleModes.NEAREST);
            }
        }        
    }
}
