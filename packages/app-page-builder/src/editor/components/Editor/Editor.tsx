import React, { useEffect } from "react";
import HTML5Backend from "react-dnd-html5-backend";
import classSet from "classnames";
import { DndProvider } from "react-dnd";
import { useKeyHandler } from "../../hooks/useKeyHandler";
import "./Editor.scss";
// Components
import EditorBar from "./Bar";
import EditorToolbar from "./Toolbar";
import EditorContent from "./Content";
import DragPreview from "./DragPreview";
import Dialogs from "./Dialogs";
import ElementSideBar from "./ElementSideBar";
import { PageAtomType, RevisionsAtomType } from "~/editor/state";
import { usePageEditor } from "~/editor/hooks/usePageEditor";
import { useUI } from "~/editor/hooks/useUI";
import { useRevisions } from "~/editor/hooks/useRevisions";
import { UndoStateChangeActionEvent } from "~/editor/actions/undo";
import { RedoStateChangeActionEvent } from "~/editor/actions/redo";
import { EditorPreviewContent } from "./EditorPreviewContent";

type EditorPropsType = {
    page: PageAtomType;
    revisions: RevisionsAtomType;
};

export const Editor: React.FunctionComponent<EditorPropsType> = ({ revisions }) => {
    const { app } = usePageEditor();
    const { addKeyHandler, removeKeyHandler } = useKeyHandler();
    const [{ isDragging, isResizing }] = useUI();

    const [, setRevisions] = useRevisions();
    const rootElementId = app.getRootElementId();

    const firstRender = React.useRef<boolean>(true);

    useEffect(() => {
        addKeyHandler("mod+z", e => {
            e.preventDefault();
            app.dispatchEvent(new UndoStateChangeActionEvent());
        });
        addKeyHandler("mod+shift+z", e => {
            e.preventDefault();
            app.dispatchEvent(new RedoStateChangeActionEvent());
        });

        setRevisions(revisions);
        return () => {
            removeKeyHandler("mod+z");
            removeKeyHandler("mod+shift+z");
        };
    }, []);

    useEffect(() => {
        if (!rootElementId || firstRender.current === true) {
            firstRender.current = false;
            return;
        }
    }, [rootElementId]);

    const classes = {
        "pb-editor": true,
        "pb-editor-dragging": isDragging,
        "pb-editor-resizing": isResizing
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={classSet(classes)}>
                <EditorBar />
                <EditorToolbar />
                <EditorContent />
                <EditorPreviewContent />
                <ElementSideBar />
                <Dialogs />
                <DragPreview />
            </div>
        </DndProvider>
    );
};
