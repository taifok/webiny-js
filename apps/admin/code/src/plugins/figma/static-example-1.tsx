import React from "react";
import { ElementPlugin } from "@webiny/app-page-builder/editor/plugins/ElementPlugin";
import { Card, previewUrl } from "./card/Card";

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
    }
});
