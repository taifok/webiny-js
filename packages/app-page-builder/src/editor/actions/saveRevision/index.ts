import { saveRevisionAction } from "./saveRevisionAction";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";

export class SaveRevisionActionEvent extends PbEditorEvent<SaveRevisionActionParamsType> {}

export class ToggleSaveRevisionStateActionEvent extends PbEditorEvent<ToggleSaveRevisionStateActionParamsType> {}

export type SaveRevisionActionParamsType = {
    debounce?: boolean;
    onFinish?: () => void;
};

export type ToggleSaveRevisionStateActionParamsType = {
    saving: boolean;
};

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
