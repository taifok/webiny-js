type Class<T> = new (...args: any[]) => T;

interface PbEventHandler<TEvent extends PbEditorEvent = PbEditorEvent> {
    (event: TEvent): void;
}

class PbEditorApp {
    private _events = new Map<Class<PbEditorEvent>, Set<PbEventHandler>>();

    dispatchEvent(event: PbEditorEvent) {
        event.app = this;
        const eventType = event.constructor as Class<PbEditorEvent>;
        const eventHandlers = Array.from(
            this._events.get(eventType) || new Set()
        ).reverse() as PbEventHandler[];

        for (const eventHandler of eventHandlers) {
            eventHandler(event);
            if (event.isStopped) {
                return;
            }
        }

        // Check if event object has child events.
    }

    addEventListener<TEvent extends PbEditorEvent = PbEditorEvent>(
        eventType: Class<TEvent>,
        cb: PbEventHandler<TEvent>
    ) {
        const callbacks = this._events.get(eventType) || new Set();
        callbacks.add(cb);
        this._events.set(eventType, callbacks);
    }
}

class PbEditorEvent {
    private _data: Record<string, any>;
    private _isStopped: boolean;
    private _app: PbEditorApp;

    constructor(data: Record<string, any>) {
        this._data = data;
    }
    
    get app() {
        return this._app;
    }
    
    set app(app: PbEditorApp) {
        this._app = app;
    }

    get data() {
        return this._data;
    }

    get isStopped() {
        return this._isStopped;
    }

    stop() {
        this._isStopped = true;
    }
}

const app = new PbEditorApp();

class MyEvent extends PbEditorEvent {
    logData() {
        console.log(this.data);
    }
}

app.addEventListener(PbEditorEvent, event => {
    console.log("Handler 1", event);
});

app.addEventListener(PbEditorEvent, event => {
    console.log("Handler 2", event);
});

app.addEventListener(PbEditorEvent, event => {
    console.log("Handler 3", event);
});

app.dispatchEvent(new PbEditorEvent({ key: "event" }));
app.dispatchEvent(new MyEvent({ key: "MyEvent" }));
