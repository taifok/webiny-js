import React from "react";
import { customAlphabet } from "nanoid";
import { PbElementSettings } from "~/editor/app/PbElementSettings";
import { PbEditorApp } from "~/editor/app/PbEditorApp";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PbEditorElement } from "~/types";
import { PbElementAction } from "~/editor/app/PbElementAction";
import { PbElementStyleSettings } from "~/editor/app/PbElementStyleSettings";
import { Pluginable } from "~/editor/app/Pluginable";

const ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const getNanoID = customAlphabet(ALPHANUMERIC, 10);

interface PbElementRendererParams {
    element: PbEditorElement;
    isActive: boolean;
}

interface PbElementRenderer {
    (params: PbElementRendererParams): JSX.Element;
}

interface PbElementCanDelete {
    (): boolean;
}

interface PbElementOnReceived {
    (params: {
        event: PbEditorEvent;
        source: Partial<PbEditorElement>;
        target: PbEditorElement;
        position: number;
    }): void;
}

interface CreateElement {
    (): Partial<PbEditorElement>;
}

interface CreateElementModifier {
    (element: PbEditorElement): PbEditorElement;
}

export class PbElementType extends Pluginable {
    private _version = process.env.REACT_APP_WEBINY_VERSION;
    private _label: string;
    private _toolbarPreview: React.ReactElement;
    private _actions: PbElementAction[];
    private _styleSettings: PbElementStyleSettings[];
    private _settings: PbElementSettings[];
    private _dropTarget = ["cell", "block"];
    private _onCreate: string; // open-settings
    private _onReceived: PbElementOnReceived;
    private _canDelete: PbElementCanDelete;
    private _createElement: CreateElement; // open-settings
    private _renderer: PbElementRenderer;
    private _app: PbEditorApp;

    getApp(): PbEditorApp {
        return this._app;
    }

    setApp(app: PbEditorApp) {
        this._app = app;
    }

    getLabel(): string {
        return this._label;
    }

    setLabel(value: string) {
        this._label = value;
    }

    getToolbarPreview(): React.ReactElement {
        return this._toolbarPreview;
    }

    setToolbarPreview(value: React.ReactElement) {
        this._toolbarPreview = value;
    }

    getSettings(): PbElementSettings[] {
        return this._settings;
    }

    addSettings(value: PbElementSettings) {
        this._settings.push(value);
    }

    setSettings(value: PbElementSettings[]) {
        this._settings = value;
    }

    getDropTarget(): string[] {
        return this._dropTarget;
    }

    setDropTarget(value: string[]) {
        this._dropTarget = value;
    }

    getCreateElement(): CreateElement {
        return this._createElement;
    }

    setCreateElement(value: CreateElement) {
        this._createElement = value;
    }

    getRenderer() {
        return this._renderer;
    }

    setRenderer(renderer: PbElementRenderer) {
        this._renderer = renderer;
    }

    getOnReceived() {
        return this._onReceived;
    }

    setOnReceived(onReceived: PbElementOnReceived) {
        this._onReceived = onReceived;
    }

    getOnCreate(): string {
        return this._onCreate;
    }

    setOnCreate(value: string) {
        this._onCreate = value;
    }

    getCanDelete(): PbElementCanDelete {
        return this._canDelete;
    }

    setCanDelete(value: PbElementCanDelete) {
        this._canDelete = value;
    }

    createElement(modifier?: CreateElementModifier): PbEditorElement {
        const data = this._createElement ? this._createElement() : this.defaultCreateElement();
        if (!data.id) {
            data.id = getNanoID();
        }

        if (!data.type) {
            data.type = this.getId();
        }

        if (!data.version) {
            data.version = this._version;
        }

        if (!data.elements) {
            data.elements = [];
        }

        if (modifier) {
            return modifier(data as PbEditorElement);
        }

        return data as PbEditorElement;
    }

    createElementFrom({ elements, data }: Partial<PbEditorElement>) {
        return { ...this.createElement(), elements, data };
    }

    render(props: PbElementRendererParams) {
        return this._renderer(props);
    }

    private defaultCreateElement(): Partial<PbEditorElement> {
        return {
            type: this.getId(),
            data: {},
            elements: []
        };
    }
}
