import "@emotion/core";
import React, { Fragment } from "react";
import Accordion from "@webiny/app-page-builder/editor/plugins/elementSettings/components/Accordion";
import InputField from "../elementSettings/components/InputField";

export const ElementProperties = ({ properties, ...rest }) => {
    if (!Object.keys(properties).length) {
        return null;
    }

    const { Bind } = rest;

    return (
        <Accordion title={"Properties"} defaultValue={true}>
            <Fragment>
                {properties.map(prop =>
                    prop.render ? (
                        React.cloneElement(prop.render({ prop, ...rest }), { key: prop.name })
                    ) : (
                        <Bind key={prop.name} name={`props.${prop.name}`}>
                            <InputField placeholder={prop.label} description={prop.description} />
                        </Bind>
                    )
                )}
            </Fragment>
        </Accordion>
    );
};
