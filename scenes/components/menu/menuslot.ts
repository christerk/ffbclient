import * as Comp from '..'

export interface MenuSlot {
    label: Comp.Label
    panel: Comp.LinearPanel
    parentPanel: Comp.LinearPanel
}

export function isMenuSlot(object: any): object is MenuSlot {
    return object["label"] !== undefined && object["panel"] !== undefined
}