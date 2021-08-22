import { UpdateElementActionParamsType } from "./types";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";

export class UpdateElementActionEvent extends PbEditorEvent<UpdateElementActionParamsType> {
    constructor(data: UpdateElementActionParamsType) {
        if (typeof data.history === "undefined") {
            data.history = true;
        }

        super(data);
    }
}
