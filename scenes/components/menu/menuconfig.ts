import * as Menu from "./index";
import {EventType} from "../../../types";

export let menuConfig: Menu.MenuPanelConfiguration = {
    orientation: Menu.Orientation.Horizontal,
    elements: [
        {
            id: 'gameMenu',
            orientation: Menu.Orientation.Vertical,
            label: 'Game',
            panel: {
                orientation: Menu.Orientation.Vertical,
                elements: [{
                    label: 'Quit',
                    id: 'quitButton',
                    event: EventType.Quit
                }]

            }
        }, {
            id: 'viewMenu',
            orientation: Menu.Orientation.Vertical,
            label: 'View',
            panel: {
                orientation: Menu.Orientation.Vertical,
                elements: [{
                    label: 'Fullscreen',
                    id: 'fullscreenButton',
                    event: EventType.FullScreen
                },{
                    label: 'Toggle Dugouts',
                    id: 'toggleDugouts',
                    event: EventType.ToggleDugouts
                }]
            }
        }]
};