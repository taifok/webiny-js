import React from "react";
import { DynamicElementPlugin } from "@webiny/app-dynamic-pages/editor/plugins/DynamicElementPlugin";
import { ElementPlugin, RenderProps } from "@webiny/app-page-builder/editor/plugins/ElementPlugin";
import { Card, previewUrl } from "./card-1/Card";
import SingleImageUpload from "@webiny/app-admin/components/SingleImageUpload";

export default [
    new DynamicElementPlugin({
        elementType: "figma-card",
        props: [
            { name: "title", label: "Title", description: "Card title" },
            { name: "description", label: "Description", description: "Card description" },
            { name: "cardImage", label: "Image", description: "Card image" }
        ],
        component: Card,
        toolbar: {
            title: "Card 1",
            group: "pb-editor-element-group-dynamic",
            preview() {
                return <img alt="Card 1" src={previewUrl} />;
            }
        }
    }),
    new ElementPlugin({
        elementType: "static-figma-card",
        props: [
            { name: "title", label: "Title", description: "Card title" },
            { name: "description", label: "Description", description: "Card description" },
            {
                name: "cardImage",
                label: "Image",
                description: "Card image",
                render({ Bind, prop }) {
                    return (
                        <Bind
                            key={prop.name}
                            name={`props.${prop.name}`}
                            beforeChange={(value, cb) => {
                                cb(value ? value.src : null);
                            }}
                        >
                            {({ value, onChange }) => (
                                <SingleImageUpload
                                    value={value && { src: value }}
                                    onChange={onChange}
                                    imagePreviewProps={{
                                        transform: { width: 300 }
                                    }}
                                />
                            )}
                        </Bind>
                    );
                }
            }
        ],
        render({ element }: RenderProps) {
            return <Card {...element.data.props} />;
        },
        toolbar: {
            title: "Card 2",
            group: "pb-editor-element-group-dynamic",
            preview() {
                return <img alt="Card 2" src={previewUrl} />;
            }
        }
    })
];
