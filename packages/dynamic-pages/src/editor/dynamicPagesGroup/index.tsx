import React from "react";
import { ReactComponent as TextIcon } from "@webiny/app-page-builder/editor/assets/icons/round-text_format-24px.svg";
import { PbEditorPageElementGroupPlugin } from "@webiny/app-page-builder/types";

export default (): PbEditorPageElementGroupPlugin => ({
    name: "pb-editor-element-group-dynamic-elements",
    type: "pb-editor-page-element-group",
    group: {
        title: "Dynamic elements",
        icon: <TextIcon />
    }
});
