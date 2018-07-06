
export enum EventType {
    ActivePlayerAction,
    Click,
    FloatText,
    ModelChanged,
    Resized,
    Resizing
}

export interface EventListener {
    handleEvent(event: EventType, data?: any): void;
}
