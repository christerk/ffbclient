import * as Comp from "../";
import {MenuEntryConfiguration, MenuNodeConfiguration, Orientation} from "./menu";
import {isMenuSlot} from "./menuslot";
import * as Core from "../../../core"
import {UIComponent} from "../";

export class MenuBuilder {

    private readonly controller: Core.Controller;

    private static zeroMarginPadding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };

    private static labelMargin = {
        left: 0.02,
        right: 0.02,
        top: 0.02,
        bottom: 0.02
    };

    private static labelPadding = {
        left: 0.12,
        right: 0.12,
        top: 0.02,
        bottom: 0.02
    };

    private static labelHeight = 0.5;
    private static labelBackground = 0xF003300;
    private static labelColor = 0xffffff;
    private static anchor = Comp.Anchor.NORTHWEST;
    private static panelBackground = 0xAAAAAA;

    constructor(controller: Core.Controller) {
        this.controller = controller;
    }

    public build(panelConfig: Comp.MenuPanelConfiguration, containerId: string): Comp.LinearPanel {
        return this.convertPanel(panelConfig, containerId, true);
    }

    private convertPanel(panelConfig: Comp.MenuPanelConfiguration, parentId: string, isRoot: boolean = false): Comp.LinearPanel {
        let self = this;
        let children = panelConfig.elements.map(function(element){return self.convertPanelChild(element, isRoot)});
        let config = this.createPanelConfig(parentId + "_panel", children, isRoot, isRoot);
        return this.createPanel(config, panelConfig.orientation);
    }

    private convertNode(nodeConfig: Comp.MenuNodeConfiguration, isRoot: boolean = false): Comp.LinearPanel {
        let wrapperConfig = this.createNodeConfig(nodeConfig.id,  nodeConfig.label, isRoot);
        let label = this.createLabel(nodeConfig.id + "_label", nodeConfig.label, isRoot);
        let panel = this.convertPanel(nodeConfig.panel, nodeConfig.id);

        return this.createSlot(wrapperConfig, nodeConfig.orientation, label, panel);
    }

    private convertEntry(entryConfig: Comp.MenuEntryConfiguration): Comp.Label {
        let config = this.createEventLabelConfig(entryConfig);
        return new Comp.Label(config, this.controller);    }

    private createLabel(id: string, label: string, isRoot: boolean = false): Comp.Label {
        let config = this.createSlotLabelConfig(id, label, isRoot);
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

    private createNodeConfig(id: string, label: string, visible: boolean): Comp.ComponentConfiguration {
        return {
            id: id,
            margin: MenuBuilder.zeroMarginPadding,
            padding: MenuBuilder.zeroMarginPadding,
            anchor: MenuBuilder.anchor,
            parentAnchor: MenuBuilder.anchor,
            color: MenuBuilder.labelColor,
            children: [],
            visible: visible,
            inheritVisibility: true,
            text: label
        }
    }

    private createEventLabelConfig(entryConfig: Comp.MenuEntryConfiguration) {
        return {
            id: entryConfig.id,
            margin: MenuBuilder.labelMargin,
            padding: MenuBuilder.labelPadding,
            height: MenuBuilder.labelHeight,
            anchor: MenuBuilder.anchor,
            parentAnchor: MenuBuilder.anchor,
            background: MenuBuilder.labelBackground,
            color: MenuBuilder.labelColor,
            children: [],
            inheritVisibility: true,
            text: entryConfig.label,
            adjustSize: true,
            interactive: true,
            event: entryConfig.event
        }
    }

    private createSlotLabelConfig(id: string, label: string, visible: boolean) {
        return  {
            id: id,
            margin: MenuBuilder.labelMargin,
            padding: MenuBuilder.labelPadding,
            height: MenuBuilder.labelHeight,
            anchor: MenuBuilder.anchor,
            parentAnchor: MenuBuilder.anchor,
            background: MenuBuilder.labelBackground,
            color: MenuBuilder.labelColor,
            children: [],
            visible: visible,
            inheritVisibility: true,
            text: label,
            adjustSize: true,
            interactive: true
        }
    }

    private createPanelConfig(id: string, children: UIComponent[], visible: boolean, triggerRecursiveRedrawAfterAdjust: boolean) {
        return {
            id: id,
            margin: MenuBuilder.zeroMarginPadding,
            padding:MenuBuilder.zeroMarginPadding,
            anchor: MenuBuilder.anchor,
            parentAnchor: MenuBuilder.anchor,
            background: MenuBuilder.panelBackground,
            children: children,
            adjustSize: true,
            visible: visible,
            triggerRecursiveRedrawAfterAdjust: triggerRecursiveRedrawAfterAdjust,
            inheritVisibility: false
        }
    }
}