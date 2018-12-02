import * as Comp from '..';
import {UIComponent} from "..";

export class VerticalMenuSlot extends Comp.VerticalPanel {

    public adjustWidthToParent(width: Comp.Size): number {
        return this.children[0].adjustWidthToParent(width);
    }

    public getWidthForParent(): number {
        if (this.children.length > 0) {
            return this.children[0].getWidthForParent();
        }
        return 0;
    }

    public childrenToAdjust(): UIComponent[] {
        let childrenCount = this.children.length
        return this.children.slice(Math.min(1), childrenCount);
    }

 /*   public redrawChildren(): void {
        for (let c of this.children){
            c.redrawChildren()
        }
    }*/

}