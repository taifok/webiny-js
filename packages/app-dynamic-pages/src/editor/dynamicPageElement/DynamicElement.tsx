import * as React from "react";
import { plugins } from "@webiny/plugins";

const DynamicElement = ({ element }) => {
    const components = plugins.byType("pb-page-element-dynamic-content-component");
    const plugin = components.find(cmp => cmp.componentName === element.data.component);

    if (!plugin) {
        return (
            <div>
                Missing component <strong>{element.data.component}</strong>
            </div>
        );
    }

    const Component = plugin.component;

    return <Component preview />;
};

export default DynamicElement;
