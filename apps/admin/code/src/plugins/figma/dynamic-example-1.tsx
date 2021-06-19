import React from "react";
import { Card, previewUrl } from "./card/Card";
import { DynamicElementPlugin } from "@webiny/app-dynamic-pages/editor/plugins/DynamicElementPlugin";

export default new DynamicElementPlugin({
    elementType: "dynamic-figma-card-1",
    properties: [
        { name: "title", label: "Title", description: "Card title" },
        { name: "description", label: "Description", description: "Card description" },
        { name: "cardImage", label: "Image", description: "Card image" }
    ],
    component: Card,
    toolbar: {
        title: "Dynamic Card 1",
        group: "pb-editor-element-group-dynamic",
        preview() {
            return <img alt="Card 1" src={previewUrl} />;
        }
    }
});
