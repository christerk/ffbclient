import * as Comp from "../index";
import * as Menu from '.';

export class MenuService {

    private togglePanelVisibilty(slot: Menu.MenuSlot) {
        let panel = slot.panel;
        panel.isVisible() ? this.hidePanelsRecursively(panel) : this.showPanel(panel, slot.parentPanel);
    }

    private hidePanelsRecursively(panel: Comp.LinearPanel) {
        panel.setVisible(false);
        for (let child of panel.children) {
            if (Menu.isMenuSlot(child)){
                this.hidePanelsRecursively(child.panel);
            }
        }
    }

    private showPanel(panel: Comp.LinearPanel, parentPanel: Comp.LinearPanel) {
        panel.setVisible(true);
        let self = this;
        if (parentPanel.children) {
            parentPanel.children.forEach(function (child: Comp.UIComponent) {
                if (Menu.isMenuSlot(child) && child.panel !== panel) {
                    self.hidePanelsRecursively(child.panel);
                }
            })
        }
    }

    public setUpInteraction(slot: Menu.MenuSlot) {
        let self = this;
        slot.label.addPointerUp(function() {
            self.togglePanelVisibilty(slot)
        });

    }
}