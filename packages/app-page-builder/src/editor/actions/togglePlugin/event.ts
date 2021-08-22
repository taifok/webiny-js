import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";
import { PluginsAtomPluginParamsType } from "~/editor/state";

export type TogglePluginActionParamsType = {
    name: string;
    params?: PluginsAtomPluginParamsType;
    closeOtherInGroup?: boolean;
};

export class TogglePluginActionEvent extends PbEditorEvent<TogglePluginActionParamsType> {}
