import * as Comp from '..';

export class HorizontalMenuSlot extends Comp.HorizontalPanel {

    public adjustWidthToParent(width: Comp.Size): number {
        if (this.children.length > 0) {
            return this.children[0].adjustWidthToParent(width);
        }
        return 0;
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