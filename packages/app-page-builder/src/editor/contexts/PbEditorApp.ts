import { plugins } from "@webiny/plugins";
import { PbElementGroup } from "~/editor/contexts/app/PbElementGroup";
import { PbElementType } from "~/editor/contexts/app/PbElementType";
import { ApplyFunction, ClassPlugin, Pluginable } from "~/editor/contexts/app/Pluginable";
import { PbEditorEvent } from "./app/PbEditorEvent";
import {
    activeElementAtom,
    elementByIdSelector,
    elementWithChildrenByIdSelector,
    pageAtom,
    pluginsAtom,
    rootElementAtom,
    uiAtom
} from "~/editor/state";
import { PbBlockType } from "~/editor/contexts/app/PbBlockType";
import { ApplyStateChangesActionEvent } from "~/editor/contexts/app/ApplyStateChangesActionEvent";
import { PbEventState } from "~/editor/contexts/app/PbEventState";
import { getState, setState } from "./RecoilExternal";
import { PbEditorElement } from "~/types";

type Class<T> = new (...args: any[]) => T;

interface PbEventHandler<TEvent extends PbEditorEvent = PbEditorEvent> {
    (event: TEvent): void;
}

export class PbEditorApp extends Pluginable {
    private _elementGroups = new Map<string, PbElementGroup>();
    private _elementTypes = new Map<string, PbElementType>();
    private _blockTypes = new Map<string, PbBlockType>();
    private _events = new Map<Class<PbEditorEvent>, Set<PbEventHandler>>();
    private _eventState: PbEventState;
    private _rootEventId: string;

    constructor() {
        super();

        this.applyPlugins(PbEditorApp);
    }

    async dispatchEvent(event: PbEditorEvent) {
        if (!this._eventState) {
            this._eventState = new PbEventState(this);
            this._rootEventId = event.getId();
        }

        event.setApp(this);
        event.setEventState(this._eventState);

        const eventType = event.constructor as Class<PbEditorEvent>;
        const eventHandlers = Array.from(
            this._events.get(eventType) || new Set()
        ).reverse() as PbEventHandler[];

        for (const eventHandler of eventHandlers) {
            await eventHandler(event);
            if (event.isStopped()) {
                return;
            }
        }

        if (!(event instanceof ApplyStateChangesActionEvent) && this._eventState) {
            this.dispatchEvent(
                new ApplyStateChangesActionEvent({ state: this._eventState.getState() })
            );
        }

        // Once we complete the event execution, we can nullify the event state.
        if (event.getId() === this._rootEventId) {
            this._eventState = null;
        }
    }

    addEventListener<TEvent extends PbEditorEvent = PbEditorEvent>(
        eventType: Class<TEvent>,
        cb: PbEventHandler<TEvent>
    ) {
        const callbacks = this._events.get(eventType) || new Set();
        callbacks.add(cb);
        this._events.set(eventType, callbacks);

        return function removeEventListener() {
            callbacks.delete(cb);
        };
    }

    addElementGroup(elementGroup: PbElementGroup) {
        this._elementGroups.set(elementGroup.getId(), elementGroup);
    }

    getElementGroups() {
        return Array.from(this._elementGroups.values());
    }

    getElementGroup(id: string) {
        return this._elementGroups.get(id);
    }

    addElementType(elementType: PbElementType) {
        elementType.setApp(this);
        this._elementTypes.set(elementType.getId(), elementType);
    }

    activateElement(id: string) {
        setState(activeElementAtom, id);
    }

    deactivateElement() {
        setState(activeElementAtom, null);
    }

    getElementType(id: string) {
        return this._elementTypes.get(id);
    }

    getElementTypes() {
        return Array.from(this._elementTypes.values());
    }

    getElementById(id: string) {
        // If there's an event currently running, check if it has the requested element.
        if (this._eventState) {
            const element = this._eventState.getElementById(id);
            if (element) {
                return element;
            }
        }

        // Return element value from state.
        return getState(elementByIdSelector(id));
    }

    getElementParentById(id): PbEditorElement {
        const element = this.getElementById(id);
        return this.getElementById(element.parent);
    }

    addBlockType(blockType: PbBlockType) {
        blockType.setApp(this);
        this._blockTypes.set(blockType.getId(), blockType);
    }

    getBlockType(id: string) {
        return this._blockTypes.get(id);
    }

    getBlockTypes() {
        return Array.from(this._blockTypes.values());
    }

    getRootElementId(): string {
        return getState(rootElementAtom);
    }

    getRootElement() {
        const id = this.getRootElementId();
        return this.getElementById(id);
    }

    getElementTree(element = undefined, path = []) {
        if (!element) {
            element = this.getElementById(this.getRootElementId());
        }

        if (element.parent) {
            path.push(element.parent);
        }

        return {
            id: element.id,
            type: element.type,
            data: element.data,
            elements: element.elements.map(child => {
                return this.getElementTree(this.getElementById(child), [...path]);
            }),
            path
        };
    }

    getPage() {
        return getState(pageAtom);
    }

    getPageContent() {
        const rootId = this.getRootElementId();
        return getState(elementWithChildrenByIdSelector(rootId));
    }

    setIsDragging(isDragging: boolean) {
        setState(uiAtom, state => ({
            ...state,
            isDragging
        }));
    }

    isPluginActive(name: string) {
        const target = plugins.byName(name);
        if (!target) {
            return false;
        }
        const state = getState(pluginsAtom);
        if (!state[target.type]) {
            return false;
        }

        const list = state[target.type];
        return list.some(({ name }) => {
            return name === target.name;
        });
    }

    getActivePluginByName(name: string) {
        const { type } = plugins.byName(name);
        if (!type) {
            return null;
        }
        const pluginsByType = this.getActivePluginsByType(type);
        const activePlugin = pluginsByType.find(pl => pl.name === name);
        if (!activePlugin) {
            return null;
        }
        return activePlugin || null;
    }

    getActivePluginsByType(type: string) {
        const plugins = getState(pluginsAtom);
        return plugins[type] || [];
    }

    deactivatePluginByName(name: string) {
        const { type } = plugins.byName(name);
        const editorPlugins = getState(pluginsAtom);
        const activePluginsByType = editorPlugins[type] || [];

        setState(pluginsAtom, state => ({
            ...state,
            [type]: activePluginsByType.filter(activePlugin => activePlugin.name !== name)
        }));
    }

    deactivatePluginByType(type: string) {
        setState(pluginsAtom, state => ({ ...state, [type]: [] }));
    }

    deactivatePluginsByName(names: string[]) {
        const editorPlugins = getState(pluginsAtom);
        for (const name of names) {
            const { type } = plugins.byName(name);
            const activePluginsByType = editorPlugins[type] || [];
            editorPlugins[type] = activePluginsByType.filter(
                activePlugin => activePlugin.name !== name
            );
        }

        setState(pluginsAtom, editorPlugins);
    }
}

export class PbEditorAppPlugin extends ClassPlugin<PbEditorApp> {
    constructor(apply: ApplyFunction<PbEditorApp>) {
        super(PbEditorApp, apply);
    }
}
