import React from "react";
import preview from "./preview.png";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { PbBlockType } from "~/editor/contexts/app/PbBlockType";

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

export default new PbEditorAppPlugin(app => {
    app.addBlockType(new GridBlockType());
});
