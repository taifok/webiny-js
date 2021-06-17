import React, { Fragment } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { EditorContentPlugin } from "~/editor/plugins/EditorContentPlugin";

export default new EditorContentPlugin({
    render({ children }) {
        return (
            <Fragment>
                {children}
                <Breadcrumbs />
            </Fragment>
        );
    }
});
