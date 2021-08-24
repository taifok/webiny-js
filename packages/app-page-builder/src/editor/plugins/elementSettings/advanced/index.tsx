import { CreateElementActionEvent } from "../../../actions";
import { advancedSettingsEditorAction } from "./advancedSettingsEditorAction";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";

export default new PbEditorAppPlugin(app => {
    app.addEventListener(CreateElementActionEvent, advancedSettingsEditorAction);
});
