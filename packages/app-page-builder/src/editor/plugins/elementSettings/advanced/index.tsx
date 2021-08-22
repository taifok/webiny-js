import { CreateElementActionEvent } from "../../../actions";
import { advancedSettingsEditorAction } from "./advancedSettingsEditorAction";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";

export default new PbEditorAppPlugin(app => {
    app.addEventListener(CreateElementActionEvent, advancedSettingsEditorAction);
});
