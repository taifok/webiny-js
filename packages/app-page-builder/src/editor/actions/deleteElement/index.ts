import { deleteElementAction } from "./action";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";
import { PbEditorElement } from "~/types";

export type DeleteElementActionParamsType = {
    element: PbEditorElement;
};

export class DeleteElementActionEvent extends PbEditorEvent<DeleteElementActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(DeleteElementActionEvent, deleteElementAction);
});
