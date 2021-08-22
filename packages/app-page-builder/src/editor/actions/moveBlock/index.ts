import { moveBlockAction } from "./action";
import { MoveBlockActionParamsType } from "./types";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";
import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";

export class MoveBlockActionEvent extends PbEditorEvent<MoveBlockActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(MoveBlockActionEvent, moveBlockAction);
});
