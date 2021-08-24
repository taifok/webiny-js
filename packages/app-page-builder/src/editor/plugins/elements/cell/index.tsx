import React from "react";
import CellContainer from "./CellContainer";
import {
    CreateElementActionEvent,
    DeleteElementActionEvent,
    UpdateElementActionEvent
} from "~/editor/actions";
import { addElementToParent, createElement } from "../../../helpers";
import { DisplayMode, PbEditorPageElementSaveActionPlugin, PbEditorElement } from "~/types";
import { AfterDropElementActionEvent } from "~/editor/actions/afterDropElement";
import { createInitialPerDeviceSettingValue } from "~/editor/plugins/elementSettings/elementSettingsUtils";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbElementType } from "~/editor/app/PbElementType";
//
// const cellPlugin = (args: PbEditorElementPluginArgs = {}): PbEditorPageElementPlugin => {
//     const defaultSettings = [
//         "pb-editor-page-element-style-settings-background",
//         "pb-editor-page-element-style-settings-animation",
//         "pb-editor-page-element-style-settings-border",
//         "pb-editor-page-element-style-settings-shadow",
//         "pb-editor-page-element-style-settings-padding",
//         "pb-editor-page-element-style-settings-margin"
//     ];
// };

// this is required because when saving cell element it cannot be without grid element
const saveActionPlugin = {
    type: "pb-editor-page-element-save-action",
    name: "pb-editor-page-element-save-action-cell",
    elementType: "cell",
    onSave(element) {
        return createElement("grid", {
            data: {
                settings: {
                    grid: {
                        cellsType: "12"
                    }
                }
            },
            elements: [
                {
                    ...element,
                    data: {
                        ...element.data,
                        settings: {
                            ...element.data.settings,
                            grid: {
                                size: "12"
                            }
                        }
                    }
                }
            ]
        });
    }
} as PbEditorPageElementSaveActionPlugin;

export class CellElementType extends PbElementType {
    constructor(id = "cell") {
        super(id);

        this.setCanDelete(() => {
            return false;
        });

        this.setRenderer(props => {
            return <CellContainer {...props} elementId={props.element.id} />;
        });

        this.setCreateElement(() => {
            return {
                type: this.getId(),
                elements: [],
                data: {
                    settings: {
                        margin: {
                            ...createInitialPerDeviceSettingValue(
                                {
                                    top: "0px",
                                    right: "0px",
                                    bottom: "0px",
                                    left: "0px",
                                    advanced: true
                                },
                                DisplayMode.DESKTOP
                            )
                        },
                        padding: createInitialPerDeviceSettingValue(
                            { all: "0px" },
                            DisplayMode.DESKTOP
                        ),
                        grid: {
                            size: 1
                        }
                    }
                }
            };
        });

        this.setOnReceived(({ event, source, position, target }) => {
            const elementType = event.getApp().getElementType(source.type);

            const element = source.id
                ? elementType.createElementFrom(source)
                : elementType.createElement();
            element.parent = target.id;

            const parent = addElementToParent(element, target, position);

            event.getApp().dispatchEvent(
                new UpdateElementActionEvent({
                    element: parent,
                    history: true
                })
            );

            event.getApp().dispatchEvent(new AfterDropElementActionEvent({ element }));

            if (source.id) {
                // Delete source element
                event.getApp().dispatchEvent(
                    new DeleteElementActionEvent({
                        element: source as PbEditorElement
                    })
                );

                return;
            }

            event.getApp().dispatchEvent(
                new CreateElementActionEvent({
                    element,
                    source: source as PbEditorElement
                })
            );
        });
    }
}

export default [
    saveActionPlugin,
    new PbEditorAppPlugin(app => {
        app.addElementType(new CellElementType());
    })
];
