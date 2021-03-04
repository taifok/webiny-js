import React from "react";
import { CmsEditorFieldRendererPlugin } from "@webiny/app-headless-cms/types";
import UserReference from "./UserReference";


const renderOptions = {
    rendererName: "userRefRenderer",
    name: "User Reference Render",
    description: "Renders user reference in editor fields.",
    canUse({ field }) {
        return field.type === "userReference";
    },
    render(props){
        console.log(props);
        const { field } = props;
        const { getBind } = props;

        return (
            <UserReference Bind={getBind()} field={field}/>
        );
    },
};

const rendererPlugin: CmsEditorFieldRendererPlugin = {
    type: "cms-editor-field-renderer",
    renderer: renderOptions
};

export default rendererPlugin;
