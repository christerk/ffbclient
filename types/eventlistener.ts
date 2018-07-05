
export enum EventType {
    ActivePlayerAction,
    Click,
    ModelChanged,
    Resizing,
    Resized
}

export interface EventListener {
    handleEvent(event: EventType, data?: any): void;
}
