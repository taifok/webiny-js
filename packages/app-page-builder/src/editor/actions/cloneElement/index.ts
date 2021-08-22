import { CloneElementActionEvent } from "./event";
import { cloneElementAction } from "./action";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";

export * from "./event";

export default new PbEditorAppPlugin(app => {
    app.addEventListener(CloneElementActionEvent, cloneElementAction);
});
