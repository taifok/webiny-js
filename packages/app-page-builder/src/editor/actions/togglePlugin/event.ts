import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";
import { PluginsAtomPluginParamsType } from "../../modules";

export type TogglePluginActionParamsType = {
    name: string;
    params?: PluginsAtomPluginParamsType;
    closeOtherInGroup?: boolean;
};

export class TogglePluginActionEvent extends PbEditorEvent<TogglePluginActionParamsType> {}
