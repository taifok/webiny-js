import React, { Fragment } from "react";
import { plugins } from "@webiny/plugins";
import { ViewPlugin } from "@webiny/app/plugins/ViewPlugin";

interface Props {
    children?: React.ReactNode;
}

interface Config<Props> {
    render(props: Props): React.ReactElement | null;
}

const VIEW_NAME = "pb.editor.config";

export class EditorContentPlugin extends ViewPlugin<Props> {
    constructor(config: Config<Props>) {
        super({ ...config, name: VIEW_NAME });
    }
}

/**
 * A component to render EditorContentPlugin plugins.
 */
export const EditorContent = ({ children, ...props }: Props) => {
    const viewPlugins = plugins
        .byType<EditorContentPlugin>(EditorContentPlugin.type)
        .filter(pl => pl.key === VIEW_NAME);

    if (viewPlugins.length) {
        children = viewPlugins.reduce((el, pl) => pl.render({ children: el, ...props }), children);
    }

    return <Fragment>{children || null}</Fragment>;
};
