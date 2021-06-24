import React from "react";
import { Plugin } from "@webiny/plugins";

interface Config {
    elements?: boolean | string[];
}

export abstract class ElementStyleSettingsPlugin<TConfig extends Config = Config> extends Plugin {
    public static readonly type = "pb-editor-page-element-style-settings";
    protected _config: TConfig;

    get elements() {
        return this._config.elements;
    }

    constructor(config?: TConfig) {
        super();
        this._config = config;
    }

    abstract render(): React.ReactElement;
}
