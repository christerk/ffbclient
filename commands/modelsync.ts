import Game from "../model/game";

export default class CommandModelSync {
    private controller;

    public constructor(controller: any) {
        this.controller = controller;
    }

    public processCommand(data: any) {
        console.log("Processing model sync command", data);

        for (let i in data['modelChangeList']['modelChangeArray']) {
            let change = data['modelChangeList']['modelChangeArray'][i];

            if (change['modelChangeId'] == "fieldModelSetPlayerCoordinate") {
                let playerId = change['modelChangeKey'];
                let [x, y] = change['modelChangeValue'];
                console.log('Moving Player', playerId, x, y);
                let player = this.controller.movePlayer(playerId, x, y);
            }
        }
    }
}
