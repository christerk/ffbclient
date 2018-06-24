//import * as WebSocket from "ws";
import LZString from "lz-string";

export default class Network {
    private ws: WebSocket;
    private config: any;

    public constructor() {
        console.log("Initializing Network");

    }

    public connect(commandHandler: any, config: any) {
        this.config = config;

        let ws: WebSocket = new WebSocket("ws://dev.fumbbl.com:22223/command");

        ws.onopen = (evt) => {
            console.log('Open');
            commandHandler.connected();
        };

        ws.onmessage = (evt) => {
            let compressed = evt.data;
            let msg = LZString.decompressFromUTF16(compressed);
            commandHandler.handleCommand(JSON.parse(msg));
        };

        ws.onclose = (evt) => {
            console.log('Close');
        };

        this.ws = ws;
    }

    public join(gameId: integer) {
        let requestVersionMessage = {
            netCommandId: "clientRequestVersion"
        };

        let joinMessage = {
            netCommandId: 'clientJoin',
            clientMode: 'spectator',
            coach: this.config.user,
            password: this.config.auth,
            gameId: parseInt(this.config.game),
            gameName: '',
            teamId: '',
            teamName: '',
        };

        this.send(requestVersionMessage);
        this.send(joinMessage);
    }

    private send(data: any) {
        let msg = JSON.stringify(data);
        let compressed = LZString.compressToUTF16(msg);
        console.log('Sending', msg);
        this.ws.send(compressed);
    }
}