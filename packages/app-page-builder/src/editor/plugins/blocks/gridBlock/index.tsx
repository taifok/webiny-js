import React from "react";
import preview from "./preview.png";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbBlockType } from "~/editor/app/PbBlockType";
import { calculatePresetCells } from "~/editor/plugins/gridPresets";
import dotProp from "dot-prop-immutable";

const width = 500;
const height = 73;
const aspectRatio = width / height;

export class GridBlockType extends PbBlockType {
    constructor(id = "grid-block") {
        super(id);

        this.setLabel("Grid block");
        this.setCategory("general");
        this.setImage({
            meta: {
                width,
                height,
                aspectRatio
            }
        });
        this.setPreview(<img src={preview} alt={"Empty grid block"} />);
        this.setCreateBlock(() => {
            const block = this.getApp().getElementType("block");
            const grid = this.getApp().getElementType("grid");

            return block.createElement(element => {
                return { ...element, elements: [...element.elements, grid.createElement()] };
            });
        });
    }
}

class TwoCellsGrid extends GridBlockType {
    constructor(id = "two-cells-grid") {
        super(id);
        this.setLabel("Two Cells Grid");
        this.setCreateBlock(() => {
            const block = this.getApp().getElementType("block");
            const grid = this.getApp().getElementType("grid");
            const cellElementType = this.getApp().getElementType("cell");

            const cells = calculatePresetCells("6-6");
            const gridCells = cells.map(size => {
                return cellElementType.createElement(element => {
                    return dotProp.set(element, "data.settings.grid.size", size);
                });
            });

            return block.createElement(element => {
                return {
                    ...element,
                    elements: [
                        ...element.elements,
                        grid.createElement(grid => {
                            return { ...grid, elements: gridCells };
                        })
                    ]
                };
            });
        });
    }
}

export default new PbEditorAppPlugin(app => {
    app.addBlockType(new GridBlockType());
});
