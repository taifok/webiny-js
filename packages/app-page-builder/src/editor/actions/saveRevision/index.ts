import { SaveRevisionActionEvent, ToggleSaveRevisionStateActionEvent } from "./event";
import { saveRevisionAction } from "./saveRevisionAction";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";

export * from "./event";

export default new PbEditorAppPlugin(app => {
    app.addEventListener(SaveRevisionActionEvent, saveRevisionAction);
    app.addEventListener(ToggleSaveRevisionStateActionEvent, event => {
        const { saving } = event.getData();

        event.setState(state => {
            return {
                ...state,
                ui: {
                    ...state.ui,
                    isSaving: saving
                }
            };
        });
    });
});
