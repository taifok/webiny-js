import { useEffect } from "react";
import { plugins } from "@webiny/plugins";
import { PbEditorPageElementPlugin } from "~/types";
import { useKeyHandler } from "~/editor/hooks/useKeyHandler";
import { userElementStyleSettingsPlugins } from "../../../helpers";
import { useActiveElement } from "~/editor/hooks/useActiveElement";

const getElementActions = plugin => {
    if (!plugin || !plugin.settings) {
        return [];
    }

    const pluginSettings = [
        ...userElementStyleSettingsPlugins(plugin.elementType),
        ...plugin.settings
    ];

    const elementActions = pluginSettings.map(pl => {
        if (typeof pl === "string") {
            return { plugin: plugins.byName(pl), options: {} };
        }

        if (Array.isArray(pl)) {
            return { plugin: plugins.byName(pl[0]), options: pl[1] };
        }

        return null;
    });

    return (
        elementActions
            // Eliminate empty plugins
            .filter(pl => {
                return pl && pl.plugin;
            })
            // Eliminate plugins other than "PbEditorPageElementStyleSettingsPlugin".
            .filter(pl => {
                return (
                    pl && pl.plugin && pl.plugin.type === "pb-editor-page-element-style-settings"
                );
            })
            // Eliminate duplicate plugins
            .filter(
                (pl, index, array) =>
                    array.findIndex(item => item.plugin.name === pl.plugin.name) === index
            )
    );
};

const useElementStyleSettings = () => {
    const [element, setActiveElement] = useActiveElement();
    const elementType = element?.type;
    
    const { addKeyHandler, removeKeyHandler } = useKeyHandler();

    useEffect(() => {
        addKeyHandler("escape", e => {
            e.preventDefault();
            setActiveElement(null)
        });
        return () => removeKeyHandler("escape");
    }, []);

    const plugin = plugins
        .byType<PbEditorPageElementPlugin>("pb-editor-page-element")
        .find(pl => pl.elementType === elementType);

    return getElementActions(plugin);
};

export default useElementStyleSettings;
