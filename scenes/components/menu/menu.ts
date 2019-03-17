import {EventType} from "../../../types";


export type MenuPanelConfiguration = {
    orientation: Orientation;
    elements: (MenuEntryConfiguration | MenuNodeConfiguration)[]
}

export type MenuNodeConfiguration = {
    id: string;
    orientation: Orientation;
    label: string;
    panel: MenuPanelConfiguration;
}

export type MenuEntryConfiguration = {
    label: string;
    id: string;
    event: EventType;
}

export enum Orientation {
    Vertical, Horizontal
}