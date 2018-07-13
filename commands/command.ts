import * as Core from "../core";

export abstract class Command {
    protected controller: Core.Controller;

    public constructor(controller: Core.Controller) {
        this.controller = controller;
    }

    abstract processCommand(data: any);
}
