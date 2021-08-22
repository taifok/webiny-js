import React from "react";
import platform from "platform";
import { ReactComponent as UndoIcon } from "../../../assets/icons/undo-icon.svg";
import { ReactComponent as RedoIcon } from "../../../assets/icons/redo-icon.svg";
import { PbEditorToolbarBottomPlugin } from "~/types";
import Action from "../Action";
import { usePageEditor } from "~/editor/hooks/usePageEditor";
import { UndoStateChangeActionEvent } from "~/editor/actions/undo";
import { RedoStateChangeActionEvent } from "~/editor/actions/redo";

const metaKey = platform.os.family === "OS X" ? "CMD" : "CTRL";

const UndoAction = () => {
    const { app } = usePageEditor();

    const onClick = () => {
        app.dispatchEvent(new UndoStateChangeActionEvent());
        app.deactivateElement();
    };
    return (
        <Action
            id={"action-undo"}
            tooltip={`Undo (${metaKey}+Z)`}
            onClick={() => onClick()}
            icon={<UndoIcon />}
        />
    );
};

const RedoAction = () => {
    const { app } = usePageEditor();
    const onClick = () => {
        app.deactivateElement();
        app.dispatchEvent(new RedoStateChangeActionEvent());
    };

    return (
        <Action
            id={"action-redo"}
            tooltip={`Redo (${metaKey}+SHIFT+Z)`}
            onClick={() => onClick()}
            icon={<RedoIcon />}
        />
    );
};

export const undo: PbEditorToolbarBottomPlugin = {
    name: "pb-editor-toolbar-undo",
    type: "pb-editor-toolbar-bottom",
    renderAction() {
        return <UndoAction />;
    }
};

export const redo: PbEditorToolbarBottomPlugin = {
    name: "pb-editor-toolbar-redo",
    type: "pb-editor-toolbar-bottom",
    renderAction() {
        return <RedoAction />;
    }
};
