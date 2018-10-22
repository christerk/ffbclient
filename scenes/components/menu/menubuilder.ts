import * as Comp from "../";
import {MenuEntryConfiguration, MenuNodeConfiguration, Orientation} from "./menu";
import {Anchor, UIComponent} from "../uicomponent";

export class MenuBuilder {

    private color: number;
    private background: number;

    constructor(color: number, background: number) {
        this.color = color;
        this.background = background;
    }

    public build(panelConfig: Comp.MenuPanelConfiguration, containerId: string): Comp.LinearPanel {
        return this.convertPanel(panelConfig, containerId);
    }

    private convertPanel(panelConfig: Comp.MenuPanelConfiguration, parentId: string): Comp.LinearPanel {
        let self = this;
        let children = panelConfig.elements.map(function(element){return self.convertPanelChild(element)});
        let config = this.createConfig(parentId + "_panel", false, "", children);
        return this.createPanel(config, panelConfig.orientation);
    }

    private convertNode(nodeConfig: Comp.MenuNodeConfiguration): Comp.LinearPanel {
        let wrapperConfig = this.createConfig(nodeConfig.id, true, nodeConfig.label);
        let labelConfig = this.createConfig(nodeConfig.id + "_label", true, nodeConfig.label);
        let label = new Comp.Label(labelConfig);
        wrapperConfig.children.push(label);
        if (nodeConfig.panel) {
            let panel = this.convertPanel(nodeConfig.panel, nodeConfig.id);
            wrapperConfig.children.push(panel);
        }

        return this.createPanel(wrapperConfig, nodeConfig.orientation);
    }

    private convertEntry(entryConfig: Comp.MenuEntryConfiguration): Comp.Label {
        let config = this.createConfig(entryConfig.id, true, entryConfig.label, []);
        return new Comp.Label(config);
    }

    private convertPanelChild(childConfig: Comp.MenuNodeConfiguration | Comp.MenuEntryConfiguration): Comp.LinearPanel | Comp.Label {
        if (childConfig["event"]) {
            return this.convertEntry(childConfig as MenuEntryConfiguration);
        } else {
            return this.convertNode(childConfig as MenuNodeConfiguration);
        }
    }


    private createPanel(config: Comp.ComponentConfiguration, orientation: Orientation){
        return orientation == Comp.Orientation.Horizontal ? new Comp.HorizontalPanel(config) : new Comp.VerticalPanel(config);
    }

    private createConfig(id: string,  inheritVisibility: boolean, label: string, children: UIComponent[] = []): Comp.ComponentConfiguration {
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
            background: this.background,
            color: this.color,
            children: children,
            visible: true,
            inheritVisibility: inheritVisibility,
            text: label,
            adjustSize: true
        }


    }
}