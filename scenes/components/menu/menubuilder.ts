import * as Comp from "../";
import {MenuEntryConfiguration, MenuNodeConfiguration, Orientation} from "./menu";
import {Anchor, UIComponent} from "../uicomponent";
import {VerticalPanel} from "../";

export class MenuBuilder {

    private color: number;
    private background: number;

    constructor(color: number, background: number) {
        this.color = color;
        this.background = background;
    }

    public build(panelConfig: Comp.MenuPanelConfiguration, containerId: string): Comp.LinearPanel {
        return this.convertPanel(panelConfig, containerId, true);
    }

    private convertPanel(panelConfig: Comp.MenuPanelConfiguration, parentId: string, isRoot: boolean = false): Comp.LinearPanel {
        let self = this;
        let children = panelConfig.elements.map(function(element){return self.convertPanelChild(element, isRoot)});
        let config = this.createConfig(parentId + "_panel", false, "", isRoot, children);
        config.triggerRecursiveRedrawAfterAdjust = isRoot;
        return this.createPanel(config, panelConfig.orientation);
    }

    private convertNode(nodeConfig: Comp.MenuNodeConfiguration, isRoot: boolean = false): Comp.LinearPanel {
        let wrapperConfig = this.createConfig(nodeConfig.id, true, nodeConfig.label, isRoot);
        let label = this.createLabel(nodeConfig.id + "_label", nodeConfig.label, isRoot);
        let panel = this.convertPanel(nodeConfig.panel, nodeConfig.id);

        return this.createSlot(wrapperConfig, nodeConfig.orientation, label, panel);
    }

    private convertEntry(entryConfig: Comp.MenuEntryConfiguration): Comp.Label {
        return this.createLabel(entryConfig.id, entryConfig.label)
    }

    private createLabel(id: string, label: string, isRoot: boolean = false): Comp.Label {
        return new Comp.Label(this.createConfig(id, true, label, isRoot));
    }

    private convertPanelChild(childConfig: Comp.MenuNodeConfiguration | Comp.MenuEntryConfiguration, isRoot: boolean = false): Comp.LinearPanel | Comp.Label {
        if (childConfig["event"]) {
            return this.convertEntry(childConfig as MenuEntryConfiguration);
        } else {
            return this.convertNode(childConfig as MenuNodeConfiguration, isRoot);
        }
    }


    private createPanel(config: Comp.ComponentConfiguration, orientation: Orientation){
        if (orientation == Comp.Orientation.Horizontal) {
           // config.background = 0x00FF00;

        } else {
           config.background = 0x00FFFF;
        }


        return orientation == Comp.Orientation.Horizontal ? new Comp.HorizontalPanel(config) : new Comp.VerticalPanel(config);
    }

    private createSlot(config: Comp.ComponentConfiguration, orientation: Orientation, label: Comp.Label, panel: Comp.LinearPanel){
        if (orientation == Comp.Orientation.Horizontal) {
          // config.background = 0xAAAAAA;

        } else {
           // config.background = 0x888888;
            //config.adjustSize = false;
        }


        return orientation == Comp.Orientation.Horizontal ? new Comp.HorizontalMenuSlot(config, label, panel) :
            new Comp.VerticalMenuSlot(config, label, panel as Comp.VerticalPanel);
    }

    private createConfig(id: string, inheritVisibility: boolean, label: string, visible: boolean, children: UIComponent[] = []): Comp.ComponentConfiguration {
        return {
            id: id,
            margin: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
            height: 1,
            anchor: Anchor.NORTHWEST,
            parentAnchor: Anchor.NORTHWEST,
           // background: this.background,
            color: this.color,
            children: children,
            visible: true,
            inheritVisibility: inheritVisibility,
            text: label,
            adjustSize: true
        }


    }
}