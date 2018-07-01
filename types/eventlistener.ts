
export enum EventType {
    Click,
    ModelChanged,
    Resizing,
    Resized
}

export interface EventListener {
    handleEvent(event: EventType, data?: any): void;
}
