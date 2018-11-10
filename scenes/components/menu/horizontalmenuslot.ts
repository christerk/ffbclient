import * as Comp from '..';
import {Size} from "..";

export class HorizontalMenuSlot extends Comp.HorizontalPanel {


    public adjustWidthToParent(width: Size): number {
        let additionalOffset = this.children[0].adjustWidthToParent(width);
        for (let c of this.children.slice(1)) {
          //  c.adjustPositionOffset(Math.floor(additionalOffset/this.ctx.scale));
        }
        return 0;
    }

    public getWidthForParent() {
        if (this.children.length > 0) {
            return this.children[0].getWidthForParent();
        }
        return 0;
    }

}