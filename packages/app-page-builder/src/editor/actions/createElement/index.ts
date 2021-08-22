import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { CreateElementEventActionParamsType } from "./types";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";
import { UpdateElementTreeActionEvent } from "~/editor/actions";

export class CreateElementActionEvent extends PbEditorEvent<CreateElementEventActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(CreateElementActionEvent, async event => {
        await event.getApp().dispatchEvent(new UpdateElementTreeActionEvent());
    });
});
