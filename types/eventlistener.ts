
export enum EventType {
    ActivePlayerAction,
    BlockChoice,
    BlockDice,
    Click,
    FloatText,
    ModelChanged,
    Resized,
    Resizing
}

export interface EventListener {
    handleEvent(event: EventType, data?: any): void;
}
