export interface MenuSlot {
    parentSlot: MenuSlot
    childSlotHoverIn()
    childSlotHoverOut()
}

export function isMenuSlot(object: any): object is MenuSlot {
    return object.parentSlot !== undefined;
}