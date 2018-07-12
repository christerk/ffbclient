
export enum EventType {
    ActivePlayerAction,
    BlockChoice,
    BlockDice,
    Click,
    Connected,
    FloatText,
    Initialized,
    ModelChanged,
    Resized,
    Resizing
}

export interface EventListener {
    handleEvent(event: EventType, data?: any): void;
}
