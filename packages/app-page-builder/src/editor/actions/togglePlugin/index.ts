import { TogglePluginActionEvent } from "./event";
import { togglePluginAction } from "./action";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";

export * from "./event";

export default new PbEditorAppPlugin(app => {
    app.addEventListener(TogglePluginActionEvent, togglePluginAction);
});
