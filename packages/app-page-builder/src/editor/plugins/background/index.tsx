import React, { Fragment } from "react";
import { EditorContentPlugin } from "~/editor/plugins/EditorContentPlugin";
import Background from "./Background";

export default new EditorContentPlugin({
    render({ children }) {
        return (
            <Fragment>
                {children}
                <Background />
            </Fragment>
        );
    }
});
