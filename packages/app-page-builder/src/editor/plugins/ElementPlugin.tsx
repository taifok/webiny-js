import React, { Fragment } from "react";
import classNames, { Argument } from "classnames";
import {
    ButtonContainer,
    SimpleButton
} from "@webiny/app-page-builder/editor/plugins/elementSettings/components/StyledComponents";
import { Plugin } from "@webiny/plugins";
import { Typography } from "@webiny/ui/Typography";
import { ElementProperties } from "~/editor/plugins/ElementPlugin/ElementProperties";
import {
    EventActionHandlerActionCallableResponse,
    EventActionHandlerCallableState,
    EventActionHandlerMeta,
    PbEditorElement
} from "~/types";
import { FormRenderPropParams } from "@webiny/form";
import { ElementRoot } from "~/render/components/ElementRoot";
import { DragObjectWithTypeWithTarget } from "~/editor/components/Droppable";

export interface ToolbarConfig {
    title: string;
    group: string;
    preview(): React.ReactElement<any>;
}

export type PropertyRenderParams = FormRenderPropParams & {
    property: Omit<Property, "render">;
    element: PbEditorElement;
};

export interface Property {
    name: string;
    label: string;
    description?: string;
    render?: string | ((params: PropertyRenderParams) => React.ReactElement);
}

export interface RenderProps {
    element: PbEditorElement;
}

export interface RenderElementSettings extends FormRenderPropParams {
    element: PbEditorElement;
    children?: React.ReactNode;
}

export interface RenderRootElement {
    element: PbEditorElement;
    children: React.ReactElement;
    className?: Argument;
}

export interface OnChildDeletedParams {
    element: PbEditorElement;
    child: PbEditorElement;
}

export enum ON_CREATE {
    OPEN_SETTINGS = "open-settings",
    SKIP = "skip"
}

export interface OnReceivedParams {
    state?: EventActionHandlerCallableState;
    meta: EventActionHandlerMeta;
    source: PbEditorElement | DragObjectWithTypeWithTarget;
    target: PbEditorElement;
    position: number | null;
}
export interface Config {
    elementType: string;
    component: React.ComponentType<any>;
    toolbar: ToolbarConfig;
    properties?: Property[];
    settings?: string[];
    target?: string[];
}

interface IElementPlugin extends Partial<Config> {
    onCreate: ON_CREATE;
    render?(props: RenderProps): React.ReactElement<any>;
    onChildDeleted?: (params: OnChildDeletedParams) => PbEditorElement | undefined;
    onReceived?: (params: OnReceivedParams) => EventActionHandlerActionCallableResponse;
    renderElementSettings?(params: RenderElementSettings): React.ReactElement<any>;
    renderElementPreview?(params: {
        element: PbEditorElement;
        width: number;
        height: number;
    }): React.ReactElement;
    renderRootElement?(params: RenderRootElement): React.ReactElement<any>;
}

const configDefaults = {
    target: ["cell", "block"],
    settings: ["pb-editor-page-element-settings-clone", "pb-editor-page-element-settings-delete"]
};

export class ElementPlugin extends Plugin implements IElementPlugin {
    public static type = "pb-editor-page-element";
    protected _config: Config;

    constructor(config?: Config) {
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

    get onCreate() {
        return ON_CREATE.SKIP;
    }

    get properties() {
        return this._config.properties;
    }

    create() {
        return {
            type: this._config.elementType,
            elements: [],
            data: {}
        };
    }
    render({ element, children }) {
        if (!children) {
            children = React.createElement(this._config.component, element.data.properties || {});
        }

        return this.renderRootElement({ element, children });
    }

    renderElementSettings(params: RenderElementSettings): React.ReactElement<any> {
        const properties = this.properties;
        const baseChildren = properties ? (
            <ElementProperties {...params} properties={this.properties} />
        ) : null;

        if (!baseChildren && !params.children) {
            return null;
        }

        return (
            <Fragment>
                {baseChildren}
                {params.children}
                <ButtonContainer style={{ display: "flex" }}>
                    <SimpleButton onClick={params.submit} style={{ margin: "0 auto" }}>
                        <Typography use={"caption"}>Save Settings</Typography>
                    </SimpleButton>
                </ButtonContainer>
            </Fragment>
        );
    }

    renderRootElement({ element, children, className }: RenderRootElement) {
        return (
            <ElementRoot
                element={element}
                className={classNames("webiny-pb-base-page-element-style", className)}
            >
                {children}
            </ElementRoot>
        );
    }

    onChildDeleted() {
        return undefined;
    }

    onReceived() {
        return undefined;
    }

    renderElementPreview(params: {
        element: PbEditorElement;
        width: number;
        height: number;
    }): React.ReactElement {
        return undefined;
    }
}
