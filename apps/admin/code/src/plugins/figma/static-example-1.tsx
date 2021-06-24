import React from "react";
import { ElementPlugin } from "@webiny/app-page-builder/editor/plugins/ElementPlugin";
import { Card, previewUrl } from "./card/Card";
import { ElementStyleSettingsPlugin } from "@webiny/app-page-builder/editor/plugins/ElementStyleSettingsPlugin";
import HorizontalAlignSettings from "./HorizontalAlignSettings";

interface Config {
    elements?: [];
    alignments: string[];
}

class HorizontalAlignStyleSettingsPlugin extends ElementStyleSettingsPlugin<Config> {
    public static id = "pb-editor-page-element-style-settings-horizontal-align";

    constructor(config: Config) {
        super(config);
    }

    render(): React.ReactElement {
        return <HorizontalAlignSettings options={{ alignments: this._config.alignments }} />;
    }
}

export default new ElementPlugin({
    elementType: "static-figma-card-1",
    component: Card,
    properties: [
        { name: "title", description: "Card title", label: "Title" },
        {
            name: "description",
            description: "Card desc",
            label: "Description"
        },
        { name: "cardImage", description: "Card image", label: "Image" }
    ],
    toolbar: {
        title: "Static Card 1",
        group: "pb-editor-element-group-dynamic",
        preview() {
            return <img alt="Card 1" src={previewUrl} />;
        }
    },
    settings: [
        "...",
        new HorizontalAlignStyleSettingsPlugin({ alignments: ["left", "center"] }),
        new HorizontalAlignStyleSettingsPlugin({ alignments: ["center", "right"] }),
    ]
});
