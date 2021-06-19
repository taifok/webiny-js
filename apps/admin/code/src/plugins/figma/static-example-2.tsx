import React from "react";
import { ElementPlugin } from "@webiny/app-page-builder/editor/plugins/ElementPlugin";
import { Card, previewUrl } from "./card/Card";
import { Input } from "@webiny/ui/Input";

export default new ElementPlugin({
    elementType: "static-figma-card-2",
    component: Card,
    properties: [
        { name: "title", description: "Card title", label: "Title", render: "input" },
        {
            name: "description",
            description: "Card desc",
            label: "Description",
            render({ Bind, property }) {
                return (
                    <Bind name={`properties.${property.name}`}>
                        <Input rows={12} label={property.label} description={property.label} />
                    </Bind>
                );
            }
        },
        { name: "cardImage", description: "Card image", label: "Image", render: "image" }
    ],
    toolbar: {
        title: "Static Card 2",
        group: "pb-editor-element-group-dynamic",
        preview() {
            return <img alt="Card 2" src={previewUrl} />;
        }
    }
});
