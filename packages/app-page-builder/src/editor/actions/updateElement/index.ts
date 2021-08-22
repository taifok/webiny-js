import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { UpdateElementActionEvent } from "./event";
import { flattenElements } from "~/editor/helpers";
import { SaveRevisionActionEvent, UpdateElementTreeActionEvent } from "~/editor/actions";

export * from "./event";

export default new PbEditorAppPlugin(app => {
    app.addEventListener(UpdateElementActionEvent, async (event: UpdateElementActionEvent) => {
        const { element, history } = event.getData();

        console.warn("TODO", "finish updateElement action");

        const flattenedContent = flattenElements(element);

        event.setState(state => {
            return { ...state, elements: flattenedContent };
        });

        if (history === true) {
            // TODO
            // if (!client) {
            //     throw new Error(
            //         "You cannot save revision while updating if you do not pass client arg."
            //     );
            // }
            await event.getApp().dispatchEvent(new SaveRevisionActionEvent());
        }
        await event.getApp().dispatchEvent(new UpdateElementTreeActionEvent());
    });
});
