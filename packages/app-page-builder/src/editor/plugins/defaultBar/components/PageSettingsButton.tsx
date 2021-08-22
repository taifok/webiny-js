import React from "react";
import { TogglePluginActionEvent } from "../../../actions";
import { IconButton } from "@webiny/ui/Button";
import { ReactComponent as SettingsIcon } from "./icons/settings.svg";
import { usePageEditor } from "~/editor/hooks/usePageEditor";

const PageSettingsButton = () => {
    const { app } = usePageEditor();
    const onClickHandler = () => {
        app.dispatchEvent(
            new TogglePluginActionEvent({
                name: "pb-editor-page-settings-bar"
            })
        );
    };
    return <IconButton onClick={onClickHandler} icon={<SettingsIcon />} />;
};

export default React.memo(PageSettingsButton);
