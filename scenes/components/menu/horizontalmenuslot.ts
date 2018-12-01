import * as Comp from '..';

export class HorizontalMenuSlot extends Comp.HorizontalPanel {

    public adjustWidthToParent(width: Comp.Size): number {
        let additionalOffset = this.children[0].adjustWidthToParent(width);
        for (let c of this.children.slice(1)) {
              c.adjustPositionOffset(additionalOffset/this.ctx.scale);
        }
        return additionalOffset;
    }

    public getWidthForParent(): number {
        if (this.children.length > 0) {
            return this.children[0].getWidthForParent();
        }
        return 0;
    }

    public redrawChildren(): void {
        super.redrawChildren();
    }

}