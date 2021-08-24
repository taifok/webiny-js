import { togglePluginAction } from "./action";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PluginsAtomPluginParamsType } from "~/editor/state";

export type TogglePluginActionParamsType = {
    name: string;
    params?: PluginsAtomPluginParamsType;
    closeOtherInGroup?: boolean;
};

export class TogglePluginActionEvent extends PbEditorEvent<TogglePluginActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(TogglePluginActionEvent, togglePluginAction);
});
