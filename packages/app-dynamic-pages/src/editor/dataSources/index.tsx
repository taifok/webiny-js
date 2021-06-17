import React, { Fragment } from "react";
import { EditorContentPlugin } from "@webiny/app-page-builder/editor/plugins/EditorContentPlugin";
import LoadDataSources from "./LoadDataSources";

export default new EditorContentPlugin({
    render({ children }) {
        return (
            <Fragment>
                {children}
                <LoadDataSources />
            </Fragment>
        );
    }
});
