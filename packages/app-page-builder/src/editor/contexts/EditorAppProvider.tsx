import React from "react";
import { PbEditorApp } from "~/editor/contexts/PbEditorApp";

export const EditorAppContext = React.createContext<{ app: PbEditorApp }>(null);

export const EditorAppProvider = ({ app, children }) => {
    return <EditorAppContext.Provider value={{ app }}>{children}</EditorAppContext.Provider>;
};
