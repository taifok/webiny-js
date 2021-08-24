import React from "react";
import Element from "~/render/components/Element";
import { usePageEditor } from "~/editor/hooks/usePageEditor";

export const EditorPreviewContent = () => {
    const { app } = usePageEditor();
    return (
        <div id={"editor-content-html"} style={{ display: "none" }}>
            {/* @ts-ignore */}
            <Element element={app.getElementTree()} />
        </div>
    );
};
