import React from "react";
import { customAlphabet } from "nanoid";
import { PbElementSettings } from "~/editor/contexts/app/PbElementSettings";
import { PbEditorApp } from "~/editor/contexts/PbEditorApp";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";
import { PbEditorElement } from "~/types";

const ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const getNanoID = customAlphabet(ALPHANUMERIC, 10);

interface PbElementRendererParams {
    element: PbEditorElement;
    isActive: boolean;
}

interface PbElementRenderer {
    (params: PbElementRendererParams): React.ReactNode;
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

export class PbElementType {
    private _version = process.env.REACT_APP_WEBINY_VERSION;
    private _id: string;
    private _label: string;
    private _toolbarPreview: React.ReactElement;
    private _settings: PbElementSettings[];
    private _target = ["cell", "block"];
    private _onCreate: string; // open-settings
    private _onReceived: PbElementOnReceived;
    private _canDelete: PbElementCanDelete;
    private _createElement: CreateElement; // open-settings
    private _renderer: PbElementRenderer;
    private _app: PbEditorApp;

    constructor(id: string) {
        this._id = id;
    }

    getApp(): PbEditorApp {
        return this._app;
    }

    setApp(app: PbEditorApp) {
        this._app = app;
    }

    getId() {
        return this._id;
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

    getTarget(): string[] {
        return this._target;
    }

    setTarget(value: string[]) {
        this._target = value;
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
            type: this._id,
            data: {},
            elements: []
        };
    }
}
