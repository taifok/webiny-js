import React, { Fragment } from "react";
import { Plugin, plugins } from "@webiny/plugins";
import { DataSource } from "~/types";

export interface Props<T = Record<string, any>> {
    onLoad: (type: string, loader: (dataSource: DataSource<T>) => Promise<any>) => void;
}

export class DataSourceLoaderPlugin<T = Record<string, any>> extends Plugin {
    public static type = "pb.dataSource.loader";
    private _component: React.ComponentType<Props<T>>;

    constructor(component?: React.ComponentType<Props<T>>) {
        super();
        this._component = component;
    }

    getComponent(): React.ComponentType<Props<T>> {
        if (!this._component) {
            return null;
        }

        if (!this._component.displayName) {
            this._component.displayName = `DataSourceLoaderPlugin`;
        }

        return this._component;
    }

    render(props: Props<T>): React.ReactElement {
        return React.createElement(this.getComponent(), { key: this.name, ...props });
    }
}

/**
 * A component to render DataSourcePlugin plugins.
 */
export const DataSourceLoader = ({ onLoad }: Props) => {
    const loaders = plugins.byType<DataSourceLoaderPlugin>(DataSourceLoaderPlugin.type);

    let children = null;

    if (loaders.length) {
        children = loaders.map(pl => React.cloneElement(pl.render({ onLoad }), { key: pl.name }));
    }

    return <Fragment>{children || null}</Fragment>;
};
