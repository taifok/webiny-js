import { plugins, Plugin } from "@webiny/plugins";

export class Pluginable {
    applyPlugins(type: any) {
        const pluginType = type.prototype.constructor.name;
        const elPlugins = plugins.byType(pluginType);

        elPlugins.filter(plugin => plugin.canHandle(type)).forEach(plugin => plugin.apply(this));
    }
}

export interface ApplyFunction<TClass> {
    (instance: TClass): void;
}

export type Class<T> = new (...args: any[]) => T;

export class ClassPlugin<TClass> extends Plugin {
    public static readonly type: string = "ClassPlugin";
    private _apply: ApplyFunction<TClass>;
    private _typeClass: Class<TClass>;

    constructor(type: Class<TClass>, apply: ApplyFunction<TClass>) {
        super();

        this._typeClass = type;
        this._apply = apply;
    }

    get type() {
        return this._typeClass.prototype.constructor.name;
    }

    canHandle(typeClass: Class<TClass>) {
        /**
         * We need to compare exact classes because we only want to run plugins for an exact class
         * and not the entire inheritance tree.
         */
        return typeClass === this._typeClass;
    }

    apply(instance: TClass) {
        this._apply(instance);
    }
}
