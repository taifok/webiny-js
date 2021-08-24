import { cloneElementAction } from "./action";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PbEditorElement } from "~/types";

export type CloneElementActionParamsType = {
    element: PbEditorElement;
};


export class CloneElementActionEvent extends PbEditorEvent<CloneElementActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(CloneElementActionEvent, cloneElementAction);
});
