import { PbState } from "~/editor/state/types";
import { PbEditorApp } from "~/editor/app/PbEditorApp";

interface PbEventStateSetter {
    (state: Partial<PbState>): Partial<PbState>;
}

export class PbEventState {
    private _app: PbEditorApp;
    private _state: Partial<PbState> = {};

    constructor(app: PbEditorApp) {
        this._app = app;
    }

    getState() {
        return this._state;
    }

    setState(stateSetter: PbEventStateSetter) {
        this._state = stateSetter(this._state);
    }

    getElementById(id: string) {
        if (this._state.elements && this._state.elements[id]) {
            return this._state.elements[id];
        }

        return null;
    }
}
