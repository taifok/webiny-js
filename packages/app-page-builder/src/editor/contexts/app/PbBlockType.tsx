import React from "react";
import { PbEditorApp } from "../PbEditorApp";
import { PbEditorElement } from "~/types";

interface PbBlockCreateBlock {
    (): Partial<PbEditorElement>;
}

interface PbBlockTypeImage {
    src?: string;
    meta: {
        width: number;
        height: number;
        aspectRatio: number;
    };
}

export class PbBlockType {
    private _id: string;
    private _label: string;
    private _category: string;
    private _tags: string[] = [];
    private _app: PbEditorApp;
    private _createBlock: PbBlockCreateBlock;
    private _image: PbBlockTypeImage;
    private _preview: React.ReactElement;

    constructor(id: string) {
        this._id = id;
    }

    getId(): string {
        return this._id;
    }

    setId(value: string) {
        this._id = value;
    }

    getLabel(): string {
        return this._label;
    }

    setLabel(value: string) {
        this._label = value;
    }

    getCategory(): string {
        return this._category;
    }

    setCategory(value: string) {
        this._category = value;
    }

    getApp(): PbEditorApp {
        return this._app;
    }

    setApp(value: PbEditorApp) {
        this._app = value;
    }

    getCreateBlock(): PbBlockCreateBlock {
        return this._createBlock;
    }

    setCreateBlock(value: PbBlockCreateBlock) {
        this._createBlock = value;
    }

    getImage(): PbBlockTypeImage {
        return this._image;
    }

    setImage(value: PbBlockTypeImage) {
        this._image = value;
    }

    getTags() {
        return this._tags;
    }

    setTags(tags: string[]) {
        this._tags = tags;
    }

    getPreview(): React.ReactElement {
        return this._preview;
    }

    setPreview(value: React.ReactElement) {
        this._preview = value;
    }

    create() {
        return this._createBlock();
    }
}
