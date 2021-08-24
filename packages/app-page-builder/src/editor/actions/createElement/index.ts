import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PbEditorElement } from "~/types";
import { UpdateElementTreeActionEvent } from "~/editor/actions";

export type CreateElementEventActionParamsType = {
    element: PbEditorElement;
    source: PbEditorElement;
};

export class CreateElementActionEvent extends PbEditorEvent<CreateElementEventActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(CreateElementActionEvent, event => {
        event.getApp().dispatchEvent(new UpdateElementTreeActionEvent());
    });
});
