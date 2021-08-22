import React from "react";
import { ReactComponent as TextIcon } from "../../../assets/icons/round-text_format-24px.svg";
import { PbElementGroup } from "~/editor/contexts/app/PbElementGroup";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";

export class BasicElementGroup extends PbElementGroup {
    constructor(id = "basic") {
        super(id);

        this.setLabel("Basic");
        this.setIcon(<TextIcon />);
    }
}

export default new PbEditorAppPlugin(app => {
    app.addElementGroup(new BasicElementGroup());
});
