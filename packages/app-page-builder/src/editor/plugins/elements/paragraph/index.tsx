import React from "react";
import { DisplayMode } from "~/types";
import Text, { textClassName } from "./Paragraph";
import { createInitialTextValue } from "../utils/textUtils";
import { createInitialPerDeviceSettingValue } from "../../elementSettings/elementSettingsUtils";
import { PbElementType } from "~/editor/contexts/app/PbElementType";

const defaultText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
     Suspendisse varius enim in eros elementum tristique.
     Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
     Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`;

export class ParagraphElementType extends PbElementType {
    constructor(id = "paragraph") {
        super(id);

        this.setLabel("Paragraph");
        this.setToolbarPreview(<p className={textClassName}>{defaultText}</p>);
        this.setRenderer(({ element }) => {
            return <Text elementId={element.id} />;
        });
        // @ts-ignore
        this.setCreateElement(() => {
            return {
                type: this.getId(),
                data: {
                    text: {
                        ...createInitialPerDeviceSettingValue(
                            createInitialTextValue({
                                type: this.getId()
                            }),
                            DisplayMode.DESKTOP
                        ),
                        data: {
                            text: defaultText
                        }
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
                }
            };
        });
    }
}
//
// export default (args: PbEditorElementPluginArgs = {}): PbEditorPageElementPlugin => {
//     const defaultSettings = [
//         "pb-editor-page-element-style-settings-text",
//         "pb-editor-page-element-style-settings-background",
//         "pb-editor-page-element-style-settings-border",
//         "pb-editor-page-element-style-settings-shadow",
//         "pb-editor-page-element-style-settings-padding",
//         "pb-editor-page-element-style-settings-margin",
//         "pb-editor-page-element-settings-clone",
//         "pb-editor-page-element-settings-delete"
//     ];
// };
