import React from "react";
import { PbEditorApp } from "~/editor/app/PbEditorApp";

export const EditorAppContext = React.createContext<{ app: PbEditorApp }>(null);

export const EditorAppProvider = ({ app, children }) => {
    return <EditorAppContext.Provider value={{ app }}>{children}</EditorAppContext.Provider>;
};
