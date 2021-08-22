import React from "react";
import { Editor as EditorComponent } from "./components/Editor";
import { EditorProvider } from "./contexts/EditorProvider";
import { RecoilRoot } from "recoil";
import {
    rootElementAtom,
    RevisionsAtomType,
    pageAtom,
    elementsAtom,
    PageAtomType
} from "./state";
import { flattenElements } from "./helpers";
import { PbEditorElement } from "../types";
import {PbEditorApp} from "~/editor/contexts/PbEditorApp";

type EditorPropsType = {
    app: PbEditorApp;
    page: PageAtomType & PbEditorElement;
    revisions: RevisionsAtomType;
};

export const Editor: React.FunctionComponent<EditorPropsType> = ({ app, page, revisions }) => {
    return (
        <RecoilRoot
            initializeState={({ set }) => {
                /* Here we initialize elementsAtom and rootElement if it exists */
                set(rootElementAtom, page.content.id);

                const elements = flattenElements(page.content);
                Object.keys(elements).forEach(key => {
                    set(elementsAtom(key), elements[key]);
                });

                const pageData = { ...page, content: undefined };
                set(pageAtom, pageData);
            }}
        >
            <EditorProvider app={app}>
                <EditorComponent page={page} revisions={revisions} />
            </EditorProvider>
        </RecoilRoot>
    );
};
