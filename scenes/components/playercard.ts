import * as Comp from ".";
import * as Model from "../../model";

export class PlayerCard extends Comp.BorderPanel {
    private numberLabel: Comp.Label;
    private positionLabel: Comp.Label;
    private nameLabel: Comp.Label;
    private sppLabel: Comp.Label;
    private maLabel: Comp.Label;
    private stLabel: Comp.Label;
    private agLabel: Comp.Label;
    private avLabel: Comp.Label;
    private portrait: Comp.Image;
    private skills: Comp.Panel;
    private skillLabels: Comp.Label[];
    private homeBackground: Comp.Panel;
    private awayBackground: Comp.Panel;

    public constructor(config: Comp.ComponentConfiguration) {
        super(config);

        this.homeBackground = new Comp.BorderPanel({
            id: "HomeBackground",
            height: "100%",
            width: "100%",
            background: 0xc91321,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: false,
        });

        this.awayBackground = new Comp.BorderPanel({
            id: "AwayBackground",
            height: "100%",
            width: "100%",
            background: 0x0100c7,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            visible: false,
        });

        this.numberLabel = new Comp.Label({
            id: "Number",
            height: 0.4,
            anchor: Comp.Anchor.SOUTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            color: 0xffffff,
            text: "#1",
            visible: false,
        });
        this.numberLabel.setStroke(1);

        this.positionLabel = new Comp.Label({
            id: "Position",
            height: 0.3,
            anchor: Comp.Anchor.NORTHEAST,
            parentAnchor: Comp.Anchor.NORTHEAST,
            color: 0xffffff,
            text: "Lineman",
            visible: false,
        });

        this.nameLabel = new Comp.Label({
            id: "Name",
            height: 0.4,
            margin: {
                left: 0.1,
                top: 0.3,
            },
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            color: 0xffffff,
            text: "Alpha Beta",
            visible: false,
        });

        this.maLabel = new Comp.Label({
            id: "maLabel",
            height: "66%",
            width: "100%",
            anchor: Comp.Anchor.SOUTH,
            parentAnchor: Comp.Anchor.SOUTH,
            color: 0x0,
            text: "6",
            visible: false,
        });

        this.stLabel = new Comp.Label({
            id: "StLabel",
            height: "66%",
            width: "100%",
            anchor: Comp.Anchor.SOUTH,
            parentAnchor: Comp.Anchor.SOUTH,
            color: 0x0,
            text: "3",
            visible: false,
        });

        this.agLabel = new Comp.Label({
            id: "AgLabel",
            height: "66%",
            width: "100%",
            anchor: Comp.Anchor.SOUTH,
            parentAnchor: Comp.Anchor.SOUTH,
            color: 0x0,
            text: "3",
            visible: false,
        });

        this.avLabel = new Comp.Label({
            id: "AvLabel",
            height: "66%",
            width: "100%",
            anchor: Comp.Anchor.SOUTH,
            parentAnchor: Comp.Anchor.SOUTH,
            color: 0x0,
            text: "7",
            visible: false,
        });

        let maPanel = new Comp.BorderPanel({
            id: "MaPanel",
            height: 0.6,
            width: 0.4,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            margin: {
                top: 0.75,
                left: 0.2,
            },
            background: 0xffffff,
            visible: false,
            children: [
                new Comp.BorderPanel({
                    id: "MaHeader",
                    height: 0.2,
                    width: 0.4,
                    anchor: Comp.Anchor.NORTH,
                    parentAnchor: Comp.Anchor.NORTH,
                    background: 0x0,
                    color: 0xffffff,
                    visible: false,
                    children: [
                        new Comp.Label({
                            id: "MaHeaderText",
                            anchor: Comp.Anchor.CENTER,
                            parentAnchor: Comp.Anchor.CENTER,
                            height: "100%",
                            width: "100%",
                            text: "MA",
                            color: 0xffffff,
                            visible: false,
                        })
                    ]
                }),
                this.maLabel,
            ]
        });

        let stPanel = new Comp.BorderPanel({
            id: "StPanel",
            height: 0.6,
            width: 0.4,
            anchor: Comp.Anchor.NORTHEAST,
            parentAnchor: Comp.Anchor.NORTH,
            margin: {
                top: 0.75,
                right: 0.2,
            },
            background: 0xffffff,
            visible: false,
            children: [
                new Comp.BorderPanel({
                    id: "StHeader",
                    height: 0.2,
                    width: 0.4,
                    anchor: Comp.Anchor.NORTH,
                    parentAnchor: Comp.Anchor.NORTH,
                    background: 0x0,
                    color: 0xffffff,
                    visible: false,
                    children: [
                        new Comp.Label({
                            id: "StHeaderText",
                            anchor: Comp.Anchor.CENTER,
                            parentAnchor: Comp.Anchor.CENTER,
                            height: "100%",
                            width: "100%",
                            text: "ST",
                            color: 0xffffff,
                            visible: false,
                        })
                    ]
                }),
                this.stLabel,
            ]
        });

        let agPanel = new Comp.BorderPanel({
            id: "AgPanel",
            height: 0.6,
            width: 0.4,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTH,
            margin: {
                top: 0.75,
                left: 0.2,
            },
            background: 0xffffff,
            visible: false,
            children: [
                new Comp.BorderPanel({
                    id: "AgHeader",
                    height: 0.2,
                    width: 0.4,
                    anchor: Comp.Anchor.NORTH,
                    parentAnchor: Comp.Anchor.NORTH,
                    background: 0x0,
                    color: 0xffffff,
                    visible: false,
                    children: [
                        new Comp.Label({
                            id: "AgHeaderText",
                            anchor: Comp.Anchor.CENTER,
                            parentAnchor: Comp.Anchor.CENTER,
                            height: "100%",
                            width: "100%",
                            text: "AG",
                            color: 0xffffff,
                            visible: false,
                        })
                    ]
                }),
                this.agLabel,
            ]
        });

        let avPanel = new Comp.BorderPanel({
            id: "AvPanel",
            height: 0.6,
            width: 0.4,
            anchor: Comp.Anchor.NORTHEAST,
            parentAnchor: Comp.Anchor.NORTHEAST,
            margin: {
                top: 0.75,
                right: 0.2,
            },
            background: 0xffffff,
            visible: false,
            children: [
                new Comp.BorderPanel({
                    id: "AvHeader",
                    height: 0.2,
                    width: 0.4,
                    anchor: Comp.Anchor.NORTH,
                    parentAnchor: Comp.Anchor.NORTH,
                    background: 0x0,
                    color: 0xffffff,
                    visible: false,
                    children: [
                        new Comp.Label({
                            id: "AvHeaderText",
                            anchor: Comp.Anchor.CENTER,
                            parentAnchor: Comp.Anchor.CENTER,
                            height: "100%",
                            width: "100%",
                            text: "AV",
                            color: 0xffffff,
                            visible: false,
                        })
                    ]
                }),
                this.avLabel,
            ]
        });

        this.portrait = new Comp.Image({
            id: "Portrait",
            height: 2.2,
            width: 1.4,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
            margin: {
                top: 1.4,
                left: 0.05,
            },
            background: 0xffffff,
            color: 0x0,
            visible: false,
        });

        this.skillLabels = [];
        for (let i=1; i<=20; i++) {
            this.skillLabels.push(new Comp.Label({
                id: "skill_"+i,
                text: "skill_"+i,
                color: 0x0,
                width: "100%",
                height: 0.2,
                anchor: Comp.Anchor.NORTHWEST,
                parentAnchor: Comp.Anchor.NORTHWEST,
                visible: false,
            }));
        }

        this.skills = new Comp.VerticalPanel({
            id: "Skills",
            height: 2.2,
            width: 1.4,
            anchor: Comp.Anchor.NORTHEAST,
            parentAnchor: Comp.Anchor.NORTHEAST,
            margin: {
                top: 1.4,
                right: 0.05,
            },
            background: 0xffffff,
            color: 0x0,
            visible: false,
            children: this.skillLabels
        });

        this.sppLabel = new Comp.Label({
            id: "SPP",
            height: 0.3,
            margin: {
                bottom: 0.05,
            },
            anchor: Comp.Anchor.SOUTH,
            parentAnchor: Comp.Anchor.SOUTH,
            color: 0xffffff,
            text: "55 + 13 Star",
            visible: false,
        });

        config.children = [];
        config.children.push(this.homeBackground);
        config.children.push(this.awayBackground);
        config.children.push(this.numberLabel);
        config.children.push(this.positionLabel);
        config.children.push(this.nameLabel);
        config.children.push(maPanel);
        config.children.push(stPanel);
        config.children.push(agPanel);
        config.children.push(avPanel);
        config.children.push(this.portrait);
        config.children.push(this.skills);
        config.children.push(this.sppLabel); 

        for (let child of config.children) {
            this.addChild(child);
        }
    }

    public destroy(): void {
        this.numberLabel.destroy();
        this.positionLabel.destroy();
        this.nameLabel.destroy();
        this.sppLabel.destroy();
        this.maLabel.destroy();
        this.stLabel.destroy();
        this.agLabel.destroy();
        this.avLabel.destroy();
        this.portrait.destroy();
        this.skills.destroy();
        this.homeBackground.destroy();
        this.awayBackground.destroy();
    }

    public setPlayer(player: Model.Player) {
        let position = player.getPosition();
        let side = player.getTeam();

        if (side == Model.Side.Home) {
            this.homeBackground.show();
            this.awayBackground.hide();
            this.homeBackground.setVisible(true);
            this.awayBackground.setVisible(false);
        } else {
            this.awayBackground.show();
            this.homeBackground.hide();
            this.awayBackground.setVisible(true);
            this.homeBackground.setVisible(false);
        }
        this.maLabel.setText(player.movement.toString());
        this.stLabel.setText(player.strength.toString());
        this.agLabel.setText(player.agility.toString());
        this.avLabel.setText(player.armour.toString());
        this.nameLabel.setText(player.name);

        this.positionLabel.setText(position.name);
        this.numberLabel.setText("#" + player.number);

        let portrait = player.getPortrait();
        if (portrait == null) {
            portrait = position.getPortrait();
        }
        this.portrait.setImage(portrait);

        let currentSpp = player.getSpp();
        let sppString = currentSpp.toString();
        let gameSpp = player.getGameSpp();
        if (gameSpp > 0) {
            sppString += " + " + gameSpp;
        }

        let rank = "Rookie";
        if (currentSpp >= 176) {
            rank = "Legend";
        } else if (currentSpp >= 76) {
            rank = "Super Star";
        } else if (currentSpp >= 51) {
            rank = "Star";
        } else if (currentSpp >= 31) {
            rank = "Emerging Star";
        } else if (currentSpp >= 16) {
            rank = "Veteran";
        } else if (currentSpp >= 6) {
            rank = "Experienced";
        }

        this.sppLabel.setText(sppString + " " + rank);

        let skills = player.getSkills();

        let index=0;
        for (let skill of skills) {
            this.skillLabels[index].setText(skill);
            this.skillLabels[index].setVisible(true);
            index++;
        }
        for (; index < this.skillLabels.length; index++) {
            this.skillLabels[index].setVisible(false);
        }
    }
}
