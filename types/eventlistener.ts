
export enum EventType {
    ActivePlayerAction,
    BlockChoice,
    BlockDice,
    Click,
    Connected,
    FloatText,
    FullScreen,
    Initialized,
    ModelChanged,
    Quit,
    Resized,
    Resizing,
    PlayerHoverStart,
    PlayerHoverEnd
}

export interface EventListener {
    handleEvent(event: EventType, data?: any): void;
}
