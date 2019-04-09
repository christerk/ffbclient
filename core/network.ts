//import * as WebSocket from "ws";
import LZString from "lz-string";

export class Network {
    private ws: WebSocket;
    private config: any;

    public constructor() {
        console.log("Initializing Network");

    }

    public connect(commandHandler: any, config: any) {
        this.config = config;

        let host = window.location.host;
        host = host.startsWith("localhost") || host.startsWith("192.168") ? "dev.fumbbl.com" : host;
        let proto = window.location.protocol == 'https:' ? 'wss:' : 'ws:';
        let port = proto == 'wss:' ? 22224 : 22223;

        console.log("Connecting to "+proto+"//"+host+":"+port);

        let ws: WebSocket = new WebSocket(proto+"//"+host+":"+port+"/command");

        ws.onopen = (evt) => {
            console.log('Open');
            this.join();
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

    public join() {
        let requestVersionMessage = {
            netCommandId: "clientRequestVersion"
        };

        let joinMessage = {
            netCommandId: 'clientJoin',
            clientMode: 'spectator',
            coach: this.config.user,
            password: this.config.auth,
            gameId: parseInt(this.config.gameId),
            gameName: '',
            teamId: '',
            teamName: '',
        };

        this.send(requestVersionMessage);
        this.send(joinMessage);
    }

    public sendChat(text: string) {
        let chatMessage = {
            netCommandId: 'clientTalk',
            talk: text,
        }

        this.send(chatMessage);
    }

    public leave() {
        let requestVersionMessage = {
            netCommandId: "clientCloseSession"
        };
        this.send(requestVersionMessage);
    }

    private send(data: any) {
        let msg = JSON.stringify(data);
        let compressed = LZString.compressToUTF16(msg);
        console.log('Sending', msg);
        this.ws.send(compressed);
    }
}
