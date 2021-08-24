import { deleteElementAction } from "./action";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PbEditorElement } from "~/types";

export type DeleteElementActionParamsType = {
    element: PbEditorElement;
};

export class DeleteElementActionEvent extends PbEditorEvent<DeleteElementActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(DeleteElementActionEvent, deleteElementAction);
});
