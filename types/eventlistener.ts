
export enum EventType {
    ModelChanged,
}

export interface EventListener {
    handleEvent(event: EventType): void;
}
