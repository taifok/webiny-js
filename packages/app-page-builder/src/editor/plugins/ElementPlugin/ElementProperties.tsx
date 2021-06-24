import "@emotion/core";
import React, { Fragment } from "react";

import SingleImageUpload from "@webiny/app-admin/components/SingleImageUpload";
import { Input } from "@webiny/ui/Input";
import InputField from "../elementSettings/components/InputField";
import { RenderElementSettings, Property } from "~/editor/plugins/ElementPlugin";

interface Renderer extends RenderElementSettings {
    property: Property;
}

export const RENDERERS: Record<string, (params: Renderer) => React.ReactElement> = {
    input({ Bind, property }) {
        return (
            <Bind key={property.name} name={`properties.${property.name}`}>
                <InputField placeholder={property.label} description={property.description} />
            </Bind>
        );
    },
    textarea({ Bind, property }) {
        return (
            <Bind key={property.name} name={`properties.${property.name}`}>
                <Input rows={4} label={property.label} description={property.label} />
            </Bind>
        );
    },
    image({ Bind, property }) {
        return (
            <Bind
                key={property.name}
                name={`properties.${property.name}`}
                beforeChange={(value, cb) => {
                    cb(value ? value.src : null);
                }}
            >
                {({ value, onChange }) => (
                    <SingleImageUpload
                        value={value && { src: value }}
                        onChange={onChange}
                        imagePreviewProps={{
                            transform: { width: 300 }
                        }}
                    />
                )}
            </Bind>
        );
    }
};

const renderProp = ({ property, ...rest }: Renderer) => {
    let element;
    const renderer = property.render;
    if (typeof renderer === "string") {
        const cb = renderer in RENDERERS ? RENDERERS[renderer] : RENDERERS.input;
        element = cb({ property, ...rest });
    } else if (typeof renderer === "function") {
        element = renderer({ property, ...rest });
    } else {
        element = RENDERERS.input({ property, ...rest });
    }

    return React.cloneElement(element, { key: property.name });
};

interface Props extends RenderElementSettings {
    properties: Property[];
}

export const ElementProperties = ({ properties, ...rest }: Props) => {
    if (!Object.keys(properties).length) {
        return null;
    }

    return <Fragment>{properties.map(property => renderProp({ property, ...rest }))}</Fragment>;
};
