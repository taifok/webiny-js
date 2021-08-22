import React from "react";
import kebabCase from "lodash/kebabCase";
import Block from "./Block";
import {
    CreateElementActionEvent,
    DeleteElementActionEvent,
    updateElementAction
} from "../../../actions";
import { addElementToParent, createDroppedElement } from "../../../helpers";
import {
    DisplayMode,
    EventActionHandlerActionCallableResponse,
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
                type: this.getId(),
                elements: [],
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
        
        this.setOnReceived(({ event }) => {
            console.log("BLock on received", event);
            return;
            // const { source, target, position = null } = event.getData();
            //
            // const element = createDroppedElement(source as any, target);
            //
            // const block = addElementToParent(element, target, position);
            //
            // const result = updateElementAction(state, meta, {
            //     element: block,
            //     history: true
            // }) as EventActionHandlerActionCallableResponse;
            //
            // result.actions.push(
            //     new AfterDropElementActionEvent({
            //         element
            //     })
            // );
            //
            // if (source.id) {
            //     // Delete source element
            //     result.actions.push(
            //         new DeleteElementActionEvent({
            //             element: source as PbEditorElement
            //         })
            //     );
            //
            //     return result;
            // }
            //
            // result.actions.push(
            //     new CreateElementActionEvent({
            //         element,
            //         source: source as any
            //     })
            // );
            // return result;
        })
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
