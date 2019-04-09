
export enum EventType {
    ActivePlayerAction,
    BlockChoice,
    BlockDice,
    Click,
    Connected,
    FloatText,
    FullScreen,
    Initialized,
    Kickoff,
    ModelChanged,
    Quit,
    Resized,
    Resizing,
    ToggleDugouts
}

export interface EventListener {
    handleEvent(event: EventType, data?: any): void;
}
