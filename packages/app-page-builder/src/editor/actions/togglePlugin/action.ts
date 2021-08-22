import { plugins } from "@webiny/plugins";
import { TogglePluginActionEvent } from "~/editor/actions";

export const togglePluginAction = (event: TogglePluginActionEvent) => {
    const { name, params = {}, closeOtherInGroup = false } = event.getData();
    const plugin = plugins.byName(name);
    if (!plugin) {
        throw new Error(`There is no plugin with name "${name}".`);
    }
    const isAlreadyActive = event.getApp().getActivePluginByName(name);
    const activePluginsByType = event.getApp().getActivePluginsByType(plugin.type)
    
    let newPluginsList;
    if (isAlreadyActive) {
        newPluginsList = activePluginsByType.filter(pl => pl.name !== name);
    } else if (closeOtherInGroup) {
        newPluginsList = [{ name, params }];
    } else {
        newPluginsList = activePluginsByType.concat([{ name, params }]);
    }

    event.setState(state => {
        return {
            ...state,
            plugins: {
                ...state.plugins,
                [plugin.type]: newPluginsList
            }
        };
    });
};
