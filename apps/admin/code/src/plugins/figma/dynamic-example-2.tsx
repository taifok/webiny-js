import React from "react";
import { Card, previewUrl } from "./card/Card";
import { CustomDynamicElementPlugin } from "./CustomDynamicElementPlugin";

export default new CustomDynamicElementPlugin({
    elementType: "dynamic-figma-card-2",
    properties: [
        { name: "title", label: "Title", description: "Card title"},
        { name: "description", label: "Description", description: "Card description"},
        { name: "cardImage", label: "Image", description: "Card image"}
    ],
    component: Card,
    toolbar: {
        title: "Dynamic Card 2",
        group: "pb-editor-element-group-dynamic",
        preview() {
            return <img alt="Card 2" src={previewUrl} />;
        }
    }
});
