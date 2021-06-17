import React, { Fragment } from "react";
import AddBlock from "./AddBlock";
import AddContent from "./AddContent";
import SearchBlocks from "./SearchBlocks";
import { PbEditorBarPlugin } from "~/types";
import { EditorContentPlugin } from "~/editor/plugins/EditorContentPlugin";

export default [
    new EditorContentPlugin({
        render({ children }) {
            return (
                <Fragment>
                    {children}
                    <AddBlock />
                </Fragment>
            );
        }
    }),
    new EditorContentPlugin({
        render() {
            return <AddContent />;
        }
    }),
    {
        name: "pb-editor-search-blocks-bar",
        type: "pb-editor-bar",
        shouldRender({ plugins }) {
            const active = plugins["pb-editor-bar"];
            if (!active || active.length === 0) {
                return false;
            }
            return active.find(pl => pl.name === "pb-editor-search-blocks-bar");
        },

        render() {
            return <SearchBlocks />;
        }
    } as PbEditorBarPlugin
];
