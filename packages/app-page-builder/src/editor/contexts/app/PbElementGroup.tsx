import React from "react";
import { PbElementType } from "~/editor/contexts/app/PbElementType";

export class PbElementGroup {
    private _id: string;
    private _label: string;
    private _icon: React.ReactElement;
    private _emptyView: React.ReactElement;
    private _elementTypes = new Set<PbElementType>();

    constructor(id: string) {
        this._id = id;
    }

    getId() {
        return this._id;
    }

    getLabel(): string {
        return this._label;
    }

    setLabel(label: string) {
        this._label = label;
    }

    getIcon(): React.ReactElement {
        return this._icon;
    }

    setIcon(icon: React.ReactElement) {
        this._icon = icon;
    }

    addElementType(elementType: PbElementType) {
        this._elementTypes.add(elementType);
    }

    removeElementType(elementType: PbElementType) {
        this._elementTypes.delete(elementType);
    }

    getElementTypes() {
        return [...this._elementTypes];
    }

    getEmptyView(): React.ReactElement {
        return this._emptyView;
    }

    setEmptyView(value: React.ReactElement) {
        this._emptyView = value;
    }
}
