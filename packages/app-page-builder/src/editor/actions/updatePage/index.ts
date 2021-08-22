import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";
import { PageAtomType } from "~/editor/state";
import { SaveRevisionActionEvent } from "~/editor/actions";

export type UpdatePageRevisionActionParamsType = {
    debounce?: boolean;
    page: Omit<PageAtomType, "content">;
    onFinish?: () => void;
};

export class UpdatePageRevisionActionEvent extends PbEditorEvent<UpdatePageRevisionActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(UpdatePageRevisionActionEvent, async event => {
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

        await event.getApp().dispatchEvent(
            new SaveRevisionActionEvent({
                debounce,
                onFinish
            })
        );
    });
});
