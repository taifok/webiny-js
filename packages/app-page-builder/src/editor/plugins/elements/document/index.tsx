import React from "react";
import Document from "./Document";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbElementType } from "~/editor/app/PbElementType";

export class DocumentElementType extends PbElementType {
    constructor(id = "document") {
        super(id);

        this.setRenderer(({ element }) => {
            return <Document element={element} />;
        });

        // this.setPreviewRenderer(({ element, Element }) => {
        //     return (
        //         <>
        //             {element.elements.map(el => {
        //                 return (
        //                     <Element
        //                         key={(el as PbEditorElement).id}
        //                         element={el as PbEditorElement}
        //                     />
        //                 );
        //             })}
        //         </>
        //     );
        // });
    }
}

export default new PbEditorAppPlugin(app => {
    app.addElementType(new DocumentElementType());
});
