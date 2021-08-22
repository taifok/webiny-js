import { AfterDropElementActionEvent } from "./event";
import { afterDropElementAction } from "./action";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";

export default new PbEditorAppPlugin(app => {
    app.addEventListener(AfterDropElementActionEvent, afterDropElementAction);
});
