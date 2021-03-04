import React from "react";
import { CmsEditorFieldTypePlugin } from "@webiny/app-headless-cms/types";
import { ReactComponent as Icon } from "./icons/user_24px.svg";

export default (): CmsEditorFieldTypePlugin => ({
    type: "cms-editor-field-type",
    name: "cms-editor-field-type-textEntry",
    field: {
        type: "userReference",
        label: `User Reference`,
        description: `A reference to users entitled to edit the content model it is attached to.`,
        icon: <Icon />,
        allowMultipleValues: true,
        allowPredefinedValues: false,
        multipleValuesLabel: `Many Users`,
        validators: ["required", "email"],
        createField() {
            return {
                type: "userReference",
                settings: {},
                validation: [],
                renderer: {
                    // we leave this empty so renderer it is automatically chosen according to canUse() in the renderer plugin
                    name: ""
                }
            };
        }
    }
});
