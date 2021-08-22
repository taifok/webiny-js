import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { UpdateElementActionEvent } from "./event";
import { flattenElements } from "~/editor/helpers";

export * from "./event";

export default new PbEditorAppPlugin(app => {
    app.addEventListener(UpdateElementActionEvent, (event: UpdateElementActionEvent) => {
        const actions = [];
        const { element, history } = event.getData();

        console.warn("TODO", "finish updateElement action");

        // if (history === true) {
        //
        //     if (!client) {
        //         throw new Error(
        //             "You cannot save revision while updating if you do not pass client arg."
        //         );
        //     }
        //     actions.push(new SaveRevisionActionEvent());
        // }
        // // Add "UpdateElementTreeActionEvent" to actions.

        const flattenedContent = flattenElements(element);

        event.setState(state => {
            return { ...state, elements: flattenedContent };
        });
    });
});
