import React, { Fragment } from "react";
import {
    ButtonContainer,
    SimpleButton
} from "@webiny/app-page-builder/editor/plugins/elementSettings/components/StyledComponents";
import { Plugin } from "@webiny/plugins";
import { Typography } from "@webiny/ui/Typography";
import { ElementProperties } from "~/editor/plugins/ElementPlugin/ElementProperties";
import { PbEditorElement } from "~/types";
import { FormRenderPropParams } from "@webiny/form";

interface ToolbarConfig {
    title: string;
    group: string;
    preview(): React.ReactElement<any>;
}

export type UserPropRenderParams = FormRenderPropParams & {
    prop: Omit<UserProp, "render">;
    element: PbEditorElement;
}

export interface UserProp {
    name: string;
    label: string;
    description?: string;
    render?(params: UserPropRenderParams): React.ReactElement;
}

export interface RenderProps {
    element: PbEditorElement;
}

export interface RenderElementSettings extends FormRenderPropParams {
    element: PbEditorElement;
    children?: React.ReactNode;
}

export interface Config {
    elementType: string;
    props?: UserProp[];
    target?: string[];
    component?: React.ComponentType<any>;
    toolbar: ToolbarConfig;
    renderElementSettings?: any;
    settings?: string[];
    render?(props: RenderProps): React.ReactElement<any>;
}

const configDefaults = {
    target: ["cell", "block"],
    settings: ["pb-editor-page-element-settings-clone", "pb-editor-page-element-settings-delete"]
};

export class ElementPlugin extends Plugin {
    public static type = "pb-editor-page-element";
    protected _config: Config;

    constructor(config: Config) {
        super();
        this._config = Object.assign({}, configDefaults, config);
    }

    get elementType() {
        return this._config.elementType;
    }

    get toolbar() {
        return this._config.toolbar;
    }

    get target() {
        return this._config.target;
    }

    get settings() {
        const settings = this._config.settings;
        if (!settings) {
            return configDefaults.settings;
        }
        const defaultsIndex = settings.findIndex(el => el === "...");
        if (defaultsIndex > -1) {
            return [
                ...settings.slice(0, defaultsIndex),
                ...configDefaults.settings,
                ...settings.slice(defaultsIndex + 1)
            ];
        }

        return settings;
    }

    create() {
        return {
            type: this._config.elementType,
            elements: [],
            data: {}
        };
    }
    render(props) {
        return this._config.render(props);
    }

    renderElementSettings(params: RenderElementSettings): React.ReactElement<any> {
        let children = <ElementProperties {...params} properties={this._config.props} />;
        if (this._config.renderElementSettings) {
            children = this._config.renderElementSettings({ ...params, children });
        }

        return (
            <Fragment>
                {children}
                <ButtonContainer style={{ display: "flex" }}>
                    <SimpleButton onClick={params.submit} style={{ margin: "0 auto" }}>
                        <Typography use={"caption"}>Save Settings</Typography>
                    </SimpleButton>
                </ButtonContainer>
            </Fragment>
        );
    }
}
