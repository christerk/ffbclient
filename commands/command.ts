import Controller from "../controller";

export abstract class Command {
    protected controller: Controller;

    public constructor(controller: Controller) {
        this.controller = controller;
    }

    abstract processCommand(data: any);
}
