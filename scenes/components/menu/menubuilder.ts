import * as Comp from "../";
import {MenuEntryConfiguration, MenuNodeConfiguration, Orientation} from "./menu";
import {isMenuSlot} from "./menuslot";
import {EventType} from "../../../types";
import * as Core from "../../../core"

export class MenuBuilder {

    private color: number;
    private background: number;
    private controller: Core.Controller;

    constructor(color: number, background: number, controller: Core.Controller) {
        this.color = color;
        this.background = background;
        this.controller = controller;
    }

    public build(panelConfig: Comp.MenuPanelConfiguration, containerId: string): Comp.LinearPanel {
        return this.convertPanel(panelConfig, containerId, true);
    }

    private convertPanel(panelConfig: Comp.MenuPanelConfiguration, parentId: string, isRoot: boolean = false): Comp.LinearPanel {
        let self = this;
        let children = panelConfig.elements.map(function(element){return self.convertPanelChild(element, isRoot)});
        let config = this.createConfig(parentId + "_panel", false, "", isRoot, null, children);
        config.triggerRecursiveRedrawAfterAdjust = isRoot;
        config.interactive = false;
        return this.createPanel(config, panelConfig.orientation);
    }

    private convertNode(nodeConfig: Comp.MenuNodeConfiguration, isRoot: boolean = false): Comp.LinearPanel {
        let wrapperConfig = this.createConfig(nodeConfig.id, true, nodeConfig.label, isRoot);
        wrapperConfig.interactive = false;
        wrapperConfig.adjustSize = false;
        let label = this.createLabel(nodeConfig.id + "_label", nodeConfig.label, isRoot, true, null);
        let panel = this.convertPanel(nodeConfig.panel, nodeConfig.id);

        return this.createSlot(wrapperConfig, nodeConfig.orientation, label, panel);
    }

    private convertEntry(entryConfig: Comp.MenuEntryConfiguration): Comp.Label {
        return this.createLabel(entryConfig.id, entryConfig.label, false, true, entryConfig.event)
    }

    private createLabel(id: string, label: string, isRoot: boolean = false, interactive: boolean = false, event: EventType): Comp.Label {
        let config = this.createConfig(id, true, label, isRoot, event);
        config.interactive = interactive;
        config.background = this.background;
        return new Comp.Label(config, this.controller);
    }

    private convertPanelChild(childConfig: Comp.MenuNodeConfiguration | Comp.MenuEntryConfiguration, isRoot: boolean = false): Comp.LinearPanel | Comp.Label {
        if (childConfig["event"]) {
            return this.convertEntry(childConfig as MenuEntryConfiguration);
        } else {
            return this.convertNode(childConfig as MenuNodeConfiguration, isRoot);
        }
    }


    private createPanel(config: Comp.ComponentConfiguration, orientation: Orientation){
        let panel =  orientation == Comp.Orientation.Horizontal ? new Comp.HorizontalPanel(config) : new Comp.VerticalPanel(config);

        if (panel.children) {
            panel.children.forEach(function(child: Comp.UIComponent){
                if (isMenuSlot(child)) {
                    child.parentPanel = panel;
                }
            })
        }

        return panel;
    }

    private createSlot(config: Comp.ComponentConfiguration, orientation: Orientation, label: Comp.Label, panel: Comp.LinearPanel){
        return orientation == Comp.Orientation.Horizontal ? new Comp.HorizontalMenuSlot(config, label, panel) :
            new Comp.VerticalMenuSlot(config, label, panel as Comp.VerticalPanel);
    }

    private createConfig(id: string, inheritVisibility: boolean, label: string, visible: boolean, event: EventType = null,
                         children: Comp.UIComponent[] = []): Comp.ComponentConfiguration {
        return {
            id: id,
            margin: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
            height: 1,
            anchor: Comp.Anchor.NORTHWEST,
            parentAnchor: Comp.Anchor.NORTHWEST,
           // background: this.background,
            color: this.color,
            children: children,
            visible: visible,
            inheritVisibility: inheritVisibility,
            text: label,
            adjustSize: true,
            interactive: true,
            event: event
        }
    }
}