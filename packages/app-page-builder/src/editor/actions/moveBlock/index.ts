import { moveBlockAction } from "./action";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";

export type MoveBlockActionParamsType = {
    source: {
        id: string;
        type: string;
        position: number;
    };
    target: {
        id: string;
        type: string;
        position: number;
    };
    rootElementId: string;
};

export class MoveBlockActionEvent extends PbEditorEvent<MoveBlockActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(MoveBlockActionEvent, moveBlockAction);
});
