import { PbEditorEvent } from "~/editor/app/PbEditorEvent";
import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";

export type DeactivatePluginActionParamsType = {
    name?: string;
    type?: string;
    names?: string[];
};

export class DeactivatePluginActionEvent extends PbEditorEvent<DeactivatePluginActionParamsType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(DeactivatePluginActionEvent, (event: DeactivatePluginActionEvent) => {
        const { name, names, type } = event.getData();
        if (name) {
            return event.getApp().deactivatePluginByName(name);
        } else if (type) {
            return event.getApp().deactivatePluginByType(type);
        } else if (names) {
            return event.getApp().deactivatePluginsByName(names);
        }
        throw new Error("Missing name, type, or names, to determine which plugins to deactivate.");
    });
});
