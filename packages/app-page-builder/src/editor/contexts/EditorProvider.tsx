import React, { createContext, useEffect, useRef } from "react";
import { PbEditorApp } from "~/editor/contexts/PbEditorApp";
import { PbEditorElement } from "~/types";
import { Snapshot, useGotoRecoilSnapshot, useRecoilCallback, useSetRecoilState } from "recoil";
import {
    activeElementAtom,
    highlightElementAtom,
    elementsAtom,
    pageAtom,
    pluginsAtom,
    sidebarAtom,
    uiAtom
} from "~/editor/state";
import { ApplyStateChangesActionEvent } from "./app/ApplyStateChangesActionEvent";
import { PbState } from "~/editor/state/types";
import RecoilExternal from "./RecoilExternal";
import { UndoStateChangeActionEvent } from "../actions/undo";
import { RedoStateChangeActionEvent } from "~/editor/actions/redo";
import {usePageEditor} from "~/editor/hooks/usePageEditor";

interface SnapshotHistory {
    past: Snapshot[];
    future: Snapshot[];
    busy: boolean;
    present: Snapshot | null;
    isBatching: boolean;
    isDisabled: boolean;
}

export interface EditorContextValue {
    app: PbEditorApp;
}
const trackedAtoms = ["elements"];
const isTrackedAtomChanged = (state: Partial<PbState>): boolean => {
    for (const atom of trackedAtoms) {
        if (!state[atom]) {
            continue;
        }
        return true;
    }
    return false;
};

export const EditorContext = createContext<EditorContextValue>(null);

export const EditorProvider: React.FunctionComponent<any> = ({ children }) => {
    const { app } = usePageEditor();
    const setActiveElementId = useSetRecoilState(activeElementAtom);
    const setHighlightElementId = useSetRecoilState(highlightElementAtom);
    const setSidebarAtomValue = useSetRecoilState(sidebarAtom);
    const setPageAtomValue = useSetRecoilState(pageAtom);
    const setPluginsAtomValue = useSetRecoilState(pluginsAtom);
    const setUiAtomValue = useSetRecoilState(uiAtom);
    const goToSnapshot = useGotoRecoilSnapshot();

    const snapshotsHistory = useRef<SnapshotHistory>({
        past: [],
        future: [],
        present: null,
        busy: false,
        isBatching: false,
        isDisabled: false
    });

    const takeSnapshot = useRecoilCallback(({ snapshot }) => () => {
        return snapshot;
    });

    const createStateHistorySnapshot = (): void => {
        if (snapshotsHistory.current.busy === true) {
            return;
        }
        snapshotsHistory.current.busy = true;
        // when saving new state history we must remove everything after the current one
        // since this is the new starting point of the state history
        snapshotsHistory.current.future = [];
        snapshotsHistory.current.past.push(takeSnapshot());
        snapshotsHistory.current.present = null;
        snapshotsHistory.current.busy = false;
    };

    const updateElements = useRecoilCallback(({ set }) => (elements: PbEditorElement[] = []) => {
        elements.forEach(item => {
            set(elementsAtom(item.id), prevValue => {
                return {
                    ...prevValue,
                    ...item,
                    parent: item.parent !== undefined ? item.parent : prevValue.parent
                };
            });
            return item.id;
        });
    });

    useEffect(() => {
        app.addEventListener(ApplyStateChangesActionEvent, event => {
            const { state } = event.getData();

            if (Object.values(state).length === 0) {
                return;
            } else if (
                history &&
                snapshotsHistory.current.isBatching === false &&
                snapshotsHistory.current.isDisabled === false &&
                isTrackedAtomChanged(state)
            ) {
                createStateHistorySnapshot();
            }

            if (state.ui) {
                setUiAtomValue(prev => ({ ...prev, ...state.ui }));
            }

            if (state.plugins) {
                setPluginsAtomValue(state.plugins);
            }

            if (state.page) {
                setPageAtomValue(prev => ({ ...prev, ...state.page }));
            }

            if (state.hasOwnProperty("activeElement")) {
                setActiveElementId(state.activeElement);
            }

            if (state.hasOwnProperty("highlightElement")) {
                setHighlightElementId(state.highlightElement);
            }

            if (state.elements) {
                updateElements(Object.values(state.elements));
            }

            if (state.sidebar) {
                setSidebarAtomValue(state.sidebar);
            }
        });
        app.addEventListener(UndoStateChangeActionEvent, () => {
            if (snapshotsHistory.current.busy === true) {
                return;
            }
            snapshotsHistory.current.busy = true;
            const previousSnapshot = snapshotsHistory.current.past.pop();
            if (!previousSnapshot) {
                snapshotsHistory.current.busy = false;
                return;
            }
            const futureSnapshot = snapshotsHistory.current.present || takeSnapshot();
            snapshotsHistory.current.future.unshift(futureSnapshot);

            snapshotsHistory.current.present = previousSnapshot;

            goToSnapshot(previousSnapshot);
            snapshotsHistory.current.busy = false;
        });
        app.addEventListener(RedoStateChangeActionEvent, () => {
            if (snapshotsHistory.current.busy === true) {
                return;
            }
            snapshotsHistory.current.busy = true;
            const nextSnapshot = snapshotsHistory.current.future.shift();
            if (!nextSnapshot) {
                snapshotsHistory.current.present = null;
                snapshotsHistory.current.busy = false;
                return;
            } else if (snapshotsHistory.current.present) {
                snapshotsHistory.current.past.push(snapshotsHistory.current.present);
            }
            snapshotsHistory.current.present = nextSnapshot;

            goToSnapshot(nextSnapshot);
            snapshotsHistory.current.busy = false;
        });
    }, []);

    window["PbEditorApp"] = app;

    return (
        <EditorContext.Provider value={{ app: app }}>
            <RecoilExternal />
            {children}
        </EditorContext.Provider>
    );
};
