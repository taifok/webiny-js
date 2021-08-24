import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PageAtomType } from "~/editor/state";
import { SaveRevisionActionEvent } from "~/editor/actions";

export type UpdatePageRevisionActionParamsType = {
    debounce?: boolean;
    page: Omit<PageAtomType, "content">;
    onFinish?: () => void;
};

export class UpdatePageRevisionActionEvent extends PbEditorEvent<UpdatePageRevisionActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(UpdatePageRevisionActionEvent, event => {
        const { debounce, onFinish, page } = event.getData();

        event.setState(state => {
            return {
                ...state,
                page: {
                    ...state.page,
                    ...page
                }
            };
        });

        event.getApp().dispatchEvent(
            new SaveRevisionActionEvent({
                debounce,
                onFinish
            })
        );
    });
});
