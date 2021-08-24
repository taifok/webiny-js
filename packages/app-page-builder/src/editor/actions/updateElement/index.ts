import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { flattenElements } from "~/editor/helpers";
import { SaveRevisionActionEvent, UpdateElementTreeActionEvent } from "~/editor/actions";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PbEditorElement } from "~/types";

export type UpdateElementActionParamsType = {
    element: PbEditorElement;
    history?: boolean;
};

export class UpdateElementActionEvent extends PbEditorEvent<UpdateElementActionParamsType> {
    constructor(data: UpdateElementActionParamsType) {
        if (typeof data.history === "undefined") {
            data.history = true;
        }

        super(data);
    }
}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(UpdateElementActionEvent, (event: UpdateElementActionEvent) => {
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
            event.getApp().dispatchEvent(new SaveRevisionActionEvent());
        }
        event.getApp().dispatchEvent(new UpdateElementTreeActionEvent());
    });
});
