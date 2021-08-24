import React from "react";
import styled from "@emotion/styled";
// import ImageSettings from "./ImageSettings";
import Image from "./Image";
import { imageCreatedEditorAction } from "./imageCreatedEditorAction";
import { ReactComponent as ImageIcon } from "./round-image-24px.svg";
import { DisplayMode, PbEditorElementPluginArgs } from "~/types";
import { Plugin } from "@webiny/plugins/types";
import { createInitialPerDeviceSettingValue } from "../../elementSettings/elementSettingsUtils";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbElementType } from "~/editor/app/PbElementType";
import { CreateElementActionEvent } from "~/editor/actions";

const PreviewBox = styled("div")({
    textAlign: "center",
    height: 50,
    svg: {
        height: 50,
        width: 50
    }
});

export class ImageElementType extends PbElementType {
    constructor(id = "image") {
        super(id);

        this.setLabel("Image");
        this.setToolbarPreview(
            <PreviewBox>
                <ImageIcon />
            </PreviewBox>
        );
        this.setCreateElement(() => ({
            data: {
                settings: {
                    horizontalAlignFlex: createInitialPerDeviceSettingValue(
                        "center",
                        DisplayMode.DESKTOP
                    ),
                    margin: createInitialPerDeviceSettingValue({ all: "0px" }, DisplayMode.DESKTOP),
                    padding: createInitialPerDeviceSettingValue({ all: "0px" }, DisplayMode.DESKTOP)
                }
            }
        }));

        this.setRenderer(({ element }) => {
            return <Image element={element} />;
        });
    }
}

export default new PbEditorAppPlugin(app => {
    const imageElementType = new ImageElementType();
    app.addElementType(imageElementType);
    app.getElementGroup("basic").addElementType(imageElementType);
    app.addEventListener(CreateElementActionEvent, imageCreatedEditorAction);
});

export const a = (args: PbEditorElementPluginArgs = {}): Plugin[] => {
    // const defaultSettings = [
    //     "pb-editor-page-element-style-settings-image",
    //     ["pb-editor-page-element-style-settings-background", { image: false }],
    //     "pb-editor-page-element-style-settings-link",
    //     "pb-editor-page-element-style-settings-border",
    //     "pb-editor-page-element-style-settings-shadow",
    //     "pb-editor-page-element-style-settings-horizontal-align-flex",
    //     "pb-editor-page-element-style-settings-padding",
    //     "pb-editor-page-element-style-settings-margin",
    //     "pb-editor-page-element-settings-clone",
    //     "pb-editor-page-element-settings-delete"
    // ];

    return [
        // {
        //     name: "pb-editor-page-element-style-settings-image",
        //     type: "pb-editor-page-element-style-settings",
        //     render() {
        //         return <ImageSettings />;
        //     }
        // } as PbEditorPageElementStyleSettingsPlugin
    ];
};
