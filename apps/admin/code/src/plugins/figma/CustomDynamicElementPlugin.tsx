import React from "react";
import { RenderElementSettings } from "@webiny/app-page-builder/editor/plugins/ElementPlugin";
import Accordion from "@webiny/app-page-builder/editor/plugins/elementSettings/components/Accordion";
import { DynamicElementPlugin } from "@webiny/app-dynamic-pages/editor/plugins/DynamicElementPlugin";

export class CustomDynamicElementPlugin extends DynamicElementPlugin {
    
    renderElementSettings(params: RenderElementSettings): React.ReactElement<any> {
        const children = (
            <Accordion title={"Custom properties"}>
                <span>Isn&apos;t this cool?</span>
            </Accordion>
        );
        return super.renderElementSettings({ ...params, children });
    }
}
