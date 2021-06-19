import React from "react";
import { InterpolateProps } from "./DynamicElementPlugin/InterpolateProps";
import {
    Config,
    ElementPlugin,
    Property
} from "@webiny/app-page-builder/editor/plugins/ElementPlugin";
import { FormRenderPropParams } from "@webiny/form";
import { HintInput } from "~/editor/components/HintInput";
import { PbEditorElement } from "@webiny/app-page-builder/types";
import { DataSourceOptions } from "./DynamicElementPlugin/DataSourceOptions";

interface RenderProperty extends FormRenderPropParams {
    property: Property;
    element: PbEditorElement;
}

export class DynamicElementPlugin extends ElementPlugin {
    constructor(config: Config) {
        super(config);

        const { properties } = this._config;
        if (properties) {
            for (const prop of properties) {
                if (!prop.render) {
                    // Set custom prop renderer because we want to use an input with data source autocomplete
                    prop.render = this._renderProp;
                }
            }
        }
    }

    create() {
        return {
            type: this._config.elementType,
            elements: [],
            data: {
                // TODO: try to avoid this and make datasource `id` be part of the variable value `id#path.subpath`
                dataSource: {
                    type: "cms-get-entry",
                    id: "get-entry",
                    path: ""
                }
            }
        };
    }
    render({ element, children }) {
        if (!children) {
            children = (
                <InterpolateProps element={element}>
                    {React.createElement(this._config.component)}
                </InterpolateProps>
            );
        }

        return super.render({ element, children });
    }

    private _renderProp({ property, element, Bind }: RenderProperty): React.ReactElement {
        return (
            <DataSourceOptions element={element}>
                {({ options }) => (
                    <Bind key={property.name} name={`properties.${property.name}`}>
                        <HintInput
                            options={options}
                            placeholder={property.label}
                            description={property.description || "Enter a data source path"}
                        />
                    </Bind>
                )}
            </DataSourceOptions>
        );
    }
}
