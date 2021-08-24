import { PbEditorApp } from "./PbEditorApp";
import { PbState } from "~/editor/state/types";
import { PbEventState } from "~/editor/app/PbEventState";
import { customAlphabet } from "nanoid";

const ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const getNanoID = customAlphabet(ALPHANUMERIC, 10);

interface PbEditorEventStateSetter {
    (state: Partial<PbState>): Partial<PbState>;
}

export class PbEditorEvent<TData = Record<string, any>> {
    private _data: TData;
    private _isStopped: boolean;
    private _app: PbEditorApp;
    private _state: PbEventState;
    private _id: string;

    constructor(data?: TData) {
        this._data = data || ({} as TData);
        this._id = getNanoID();
    }

    getId() {
        return this._id;
    }

    getDisplayName() {
        return `${this.constructor.name} (${this._id})`;
    }

    getApp() {
        return this._app;
    }

    setApp(app: PbEditorApp) {
        this._app = app;
    }

    getData() {
        return this._data;
    }

    setState(stateSetter: PbEditorEventStateSetter) {
        this._state.setState(stateSetter);
    }

    isStopped() {
        return this._isStopped;
    }

    stop() {
        this._isStopped = true;
    }

    getState() {
        return this._state.getState();
    }

    /**
     * !WARNING!
     * Do not use this method. It is for internal processes only.
     * @param state
     */
    setEventState(state: PbEventState) {
        this._state = state;
    }
}
