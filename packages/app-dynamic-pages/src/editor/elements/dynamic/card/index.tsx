import React from "react";
import { PluginCollection } from "@webiny/plugins/types";
import {
    DisplayMode,
    PbEditorPageElementAdvancedSettingsPlugin,
    PbEditorPageElementPlugin
} from "@webiny/app-page-builder/types";
import { createInitialTextValue } from "@webiny/app-page-builder/editor/plugins/elements/utils/textUtils";
import { createInitialPerDeviceSettingValue } from "@webiny/app-page-builder/editor/plugins/elementSettings/elementSettingsUtils";
import { AdvancedSettings } from "./AdvancedSettings";
import Text, { textClassName } from "./Paragraph";

export default (): PluginCollection => {
    const defaultText = `A card!`;

    return [
        {
            name: "pb-editor-page-element-dynamic-card",
            type: "pb-editor-page-element",
            elementType: "dynamic-card",
            toolbar: {
                title: "Card",
                group: "pb-editor-element-group-dynamic",
                preview() {
                    return <p className={textClassName}>{defaultText}</p>;
                }
            },
            settings: [
                "pb-editor-page-element-style-settings-text",
                "pb-editor-page-element-style-settings-background",
                "pb-editor-page-element-style-settings-border",
                "pb-editor-page-element-style-settings-shadow",
                "pb-editor-page-element-style-settings-padding",
                "pb-editor-page-element-style-settings-margin",
                "pb-editor-page-element-settings-clone",
                "pb-editor-page-element-settings-delete"
            ],
            target: ["cell", "block"],
            create({ content = {}, ...options }) {
                const previewText = content.text || defaultText;

                return {
                    type: "dynamic-card",
                    elements: [],
                    data: {
                        text: {
                            ...createInitialPerDeviceSettingValue(
                                createInitialTextValue({
                                    type: this.elementType
                                }),
                                DisplayMode.DESKTOP
                            ),
                            data: {
                                text: previewText
                            }
                        },
                        dataSource: {
                            type: "cms-get-entry",
                            id: "get-entry",
                            path: ""
                        },
                        settings: {
                            margin: createInitialPerDeviceSettingValue(
                                { all: "0px" },
                                DisplayMode.DESKTOP
                            ),
                            padding: createInitialPerDeviceSettingValue(
                                { all: "0px" },
                                DisplayMode.DESKTOP
                            )
                        }
                    },
                    ...options
                };
            },
            render({ element }) {
                return <Text elementId={element.id} />;
            }
        } as PbEditorPageElementPlugin,
        {
            name: "pb-editor-page-element-advanced-settings-dynamic-paragraph",
            type: "pb-editor-page-element-advanced-settings",
            elementType: "dynamic-card",
            render({ Bind, submit, data }) {
                return <AdvancedSettings Bind={Bind} submit={submit} data={data} />;
            }
        } as PbEditorPageElementAdvancedSettingsPlugin
    ];
};
