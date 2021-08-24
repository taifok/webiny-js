import { plugins } from "@webiny/plugins";
import { PbElementGroup } from "./PbElementGroup";
import { PbElementType } from "./PbElementType";
import { ApplyFunction, ClassPlugin, Pluginable } from "./Pluginable";
import { PbEditorEvent } from "./PbEditorEvent";
import {
    activeElementAtom,
    elementByIdSelector,
    elementWithChildrenByIdSelector,
    highlightElementAtom,
    pageAtom,
    pluginsAtom,
    rootElementAtom,
    uiAtom
} from "~/editor/state";
import { PbBlockType } from "./PbBlockType";
import { ApplyStateChangesActionEvent } from "./ApplyStateChangesActionEvent";
import { PbEventState } from "./PbEventState";
import { getState, setState, ValueOrSetter } from "../components/RecoilExternal";
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
    private _eventDepth = 0;

    constructor() {
        super("PbEditorApp");

        this.applyPlugins();
    }

    dispatchEvent(event: PbEditorEvent) {
        if (!this._rootEventId) {
            this._eventState = new PbEventState(this);
            this._rootEventId = event.getId();
        }
        this._eventDepth++;

        console.group(event.getDisplayName());
        console.log("Event data:", event.getData());

        event.setApp(this);
        event.setEventState(this._eventState);

        const eventType = event.constructor as Class<PbEditorEvent>;
        const eventHandlers = Array.from(
            this._events.get(eventType) || new Set()
        ).reverse() as PbEventHandler[];

        for (const eventHandler of eventHandlers) {
            eventHandler(event);
            if (event.isStopped()) {
                return;
            }
        }

        // Once we complete the event execution, we can nullify the event state.
        if (event.getId() === this._rootEventId) {
            if (!(event instanceof ApplyStateChangesActionEvent) && this._eventState) {
                if (Object.keys(this._eventState.getState()).length > 0) {
                    this.dispatchEvent(
                        new ApplyStateChangesActionEvent({ state: this._eventState.getState() })
                    );
                }
            }
            this._rootEventId = null;
        }

        this._eventDepth--;

        console.groupEnd();
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
        elementType.applyPlugins();
        this._elementTypes.set(elementType.getId(), elementType);
    }

    activateElement(id: string) {
        setState(activeElementAtom, id);
    }

    deactivateElement() {
        setState(activeElementAtom, null);
    }

    highlightElement(id: string) {
        const highlightedElement = getState(highlightElementAtom);
        if (highlightedElement) {
            // Un-highlight the element that is currently highlighted.
            this.updateElementById(highlightedElement, prevValue => {
                return {
                    ...prevValue,
                    isHighlighted: false
                };
            });
        }

        // Set the new highlighted element
        setState(highlightElementAtom, id);

        // Update the element that is about to be highlighted
        this.updateElementById(id, prevValue => {
            return {
                ...prevValue,
                isHighlighted: true
            };
        });
    }

    getElementType(id: string): PbElementType {
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

    updateElementById(id: string, setter: ValueOrSetter<PbEditorElement>) {
        setState(elementByIdSelector(id), setter);
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

    private setupLegacyPlugins() {}
}

export class PbEditorAppPlugin extends ClassPlugin<PbEditorApp> {
    constructor(apply: ApplyFunction<PbEditorApp>) {
        super(PbEditorApp, apply);
    }
}
