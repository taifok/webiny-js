import React from "react";
import Document from "./Document";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { PbElementType } from "~/editor/contexts/app/PbElementType";

export class DocumentElementType extends PbElementType {
    constructor(id = "document") {
        super(id);

        this.setRenderer(({ element }) => {
            return <Document element={element} />;
        });
    }
}

export default new PbEditorAppPlugin(app => {
    app.addElementType(new DocumentElementType());
});
