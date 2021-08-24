import React from "react";
import styled from "@emotion/styled";
import dotProp from "dot-prop-immutable";
import GridContainer from "./GridContainer";
import { ReactComponent as GridIcon } from "~/editor/assets/icons/view_quilt.svg";
import { DisplayMode } from "~/types";
import { getDefaultPresetCellsTypePluginType, calculatePresetCells } from "../../gridPresets";
import { createInitialPerDeviceSettingValue } from "../../elementSettings/elementSettingsUtils";
import { PbElementType } from "~/editor/app/PbElementType";
import { PbEditorApp, PbEditorAppPlugin } from "~/editor/app/PbEditorApp";

const PreviewBox = styled("div")({
    textAlign: "center",
    height: 50,
    svg: {
        height: 50,
        width: 50
    }
});

const createDefaultCells = (app: PbEditorApp, cellsType: string) => {
    const cellElementType = app.getElementType("cell");
    const cells = calculatePresetCells(cellsType);
    return cells.map(size => {
        return cellElementType.createElement(element => {
            return dotProp.set(element, "data.settings.grid.size", size);
        });
    });
};

export class GridElementType extends PbElementType {
    constructor(id = "grid") {
        super(id);

        this.setLabel("Grid");
        this.setToolbarPreview(
            <PreviewBox>
                <GridIcon />
            </PreviewBox>
        );

        this.setRenderer(({ element }) => {
            return <GridContainer element={element} />;
        });

        // @ts-ignore
        this.setCreateElement(() => {
            const cellsType = getDefaultPresetCellsTypePluginType();

            return {
                type: this.getId(),
                elements: createDefaultCells(this.getApp(), cellsType),
                data: {
                    settings: {
                        width: createInitialPerDeviceSettingValue(
                            { value: "1100px" },
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
                        grid: {
                            cellsType
                        },
                        horizontalAlignFlex: createInitialPerDeviceSettingValue(
                            "flex-start",
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
    }
}

export default new PbEditorAppPlugin(app => {
    const gridElementType = new GridElementType();
    const basicGroup = app.getElementGroup("basic");
    basicGroup.addElementType(gridElementType);
    app.addElementType(gridElementType);
});

// export default (args: PbEditorElementPluginArgs = {}) => {
//     const defaultSettings = [
//         "pb-editor-page-element-style-settings-grid",
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
