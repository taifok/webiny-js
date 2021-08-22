import React from "react";
import kebabCase from "lodash/kebabCase";
import Block from "./Block";
import {
    CreateElementActionEvent,
    DeleteElementActionEvent,
    UpdateElementActionEvent
} from "~/editor/actions";
import { addElementToParent, createDroppedElement } from "../../../helpers";
import {
    DisplayMode,
    PbEditorPageElementPlugin,
    PbEditorElement,
    PbEditorElementPluginArgs
} from "~/types";
import { AfterDropElementActionEvent } from "../../../actions/afterDropElement";
import { createInitialPerDeviceSettingValue } from "../../elementSettings/elementSettingsUtils";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { PbElementType } from "~/editor/contexts/app/PbElementType";

class BlockElementType extends PbElementType {
    constructor(id = "block") {
        super(id);

        // @ts-ignore
        this.setCreateElement(() => {
            return {
                data: {
                    settings: {
                        width: createInitialPerDeviceSettingValue(
                            { value: "100%" },
                            DisplayMode.DESKTOP
                        ),
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
                            { all: "10px" },
                            DisplayMode.DESKTOP
                        ),
                        horizontalAlignFlex: createInitialPerDeviceSettingValue(
                            "center",
                            DisplayMode.DESKTOP
                        ),
                        verticalAlign: createInitialPerDeviceSettingValue(
                            "flex-start",
                            DisplayMode.DESKTOP
                        )
                    }
                }
            };
        });

        this.setRenderer(props => {
            return <Block {...props} />;
        });

        this.setOnReceived(async ({ event, source, target, position }) => {
            const sourceElementType = event.getApp().getElementType(source.type);
            const element = sourceElementType.createElement(element => {
                element.parent = target.id;
                if (source.id) {
                    element.elements = source.elements;
                    element.data = source.data;
                }
                return element;
            });

            const blockElement = addElementToParent(element, target, position);

            console.log("==============ovaj UpdateElementActionEvent==============");
            await event
                .getApp()
                .dispatchEvent(new UpdateElementActionEvent({ element: blockElement }));

            console.log("==============ovaj AfterDropElementActionEvent==============");
            await event.getApp().dispatchEvent(
                new AfterDropElementActionEvent({
                    element
                })
            );

            if (source.id) {
                // Delete source element
                await event.getApp().dispatchEvent(
                    new DeleteElementActionEvent({
                        element: source as PbEditorElement
                    })
                );

                return;
            }

            await event.getApp().dispatchEvent(
                new CreateElementActionEvent({
                    element,
                    source: source as any
                })
            );
        });
    }
}

export default new PbEditorAppPlugin(app => {
    app.addElementType(new BlockElementType());
});

// export default (args: PbEditorElementPluginArgs = {}): PbEditorPageElementPlugin => {
//     const elementSettings = [
//         "pb-editor-page-element-style-settings-background",
//         "pb-editor-page-element-style-settings-animation",
//         "pb-editor-page-element-style-settings-border",
//         "pb-editor-page-element-style-settings-shadow",
//         "pb-editor-page-element-style-settings-padding",
//         "pb-editor-page-element-style-settings-margin",
//         "pb-editor-page-element-style-settings-width",
//         "pb-editor-page-element-style-settings-height",
//         "pb-editor-page-element-style-settings-horizontal-align-flex",
//         "pb-editor-page-element-style-settings-vertical-align",
//         "pb-editor-page-element-settings-clone",
//         "pb-editor-page-element-settings-delete"
//     ];
// };
