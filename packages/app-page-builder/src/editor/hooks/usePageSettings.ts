import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { pageAtom } from "~/editor/state";
import { useKeyHandler } from "~/editor/hooks/useKeyHandler";
import {
    DeactivatePluginActionEvent,
    UpdatePageRevisionActionEvent
} from "~/editor/actions";
import { usePageEditor } from "~/editor/hooks/usePageEditor";

export type UsePageSettings = ReturnType<typeof usePageSettings>;

export function usePageSettings() {
    const [activeSection, setActiveSection] = useState<string>(null);
    const { app } = usePageEditor();
    const pageData = useRecoilValue(pageAtom);

    const { showSnackbar } = useSnackbar();
    const { removeKeyHandler, addKeyHandler } = useKeyHandler();

    const closeSettings = useCallback(() => {
        app.dispatchEvent(
            new DeactivatePluginActionEvent({
                name: "pb-editor-page-settings-bar"
            })
        );
    }, []);

    const savePage = useCallback(pageValue => {
        app.dispatchEvent(
            new UpdatePageRevisionActionEvent({
                debounce: false,
                page: pageValue,
                onFinish: () => {
                    showSnackbar("Settings saved!");
                    closeSettings();
                }
            })
        );
    }, []);

    useEffect(() => {
        addKeyHandler("escape", e => {
            e.preventDefault();
            closeSettings();
        });

        return () => removeKeyHandler("escape");
    });

    return { setActiveSection, activeSection, savePage, closeSettings, pageData };
}
