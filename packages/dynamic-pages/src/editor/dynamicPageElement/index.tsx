import React from "react";
import {
    PbEditorPageElementPlugin,
    PbRenderElementPlugin,
    PbEditorPageElementAdvancedSettingsPlugin
} from "@webiny/app-page-builder/types";
import { Tab } from "@webiny/ui/Tabs";
import styled from "@emotion/styled";
import { ReactComponent as DynamicElementIcon } from "./icon.svg";
import DynamicElement from "./DynamicElement";
import DynamicElementSettings from "./DynamicElementSettings";

export default () => {
    const PreviewBox = styled("div")({
        textAlign: "center",
        margin: "0 auto",
        width: 100,
        svg: {
            width: 100
        }
    });

    return [
        {
            name: "pb-editor-page-element-dynamic-content",
            type: "pb-editor-page-element",
            elementType: "dynamic-content",
            toolbar: {
                title: "Dynamic Content",
                group: "pb-editor-element-group-dynamic-elements",
                preview() {
                    return (
                        <PreviewBox>
                            <DynamicElementIcon />
                        </PreviewBox>
                    );
                }
            },
            settings: ["pb-editor-page-element-settings-delete"],
            target: ["row", "column"],
            onCreate: "open-settings",
            create() {
                return {
                    type: "dynamic-content",
                    data: {
                        dataSource: null
                    }
                };
            },
            render({ element }) {
                return <DynamicElement element={element}/>;
            }
        } as PbEditorPageElementPlugin,
        {
            name: "pb-editor-page-element-advanced-settings-dynamic-content",
            type: "pb-editor-page-element-advanced-settings",
            elementType: "dynamic-content",
            render(props) {
                return (
                    <Tab label="Data">
                        <DynamicElementSettings {...props} />
                    </Tab>
                );
            }
        } as PbEditorPageElementAdvancedSettingsPlugin,
        {
            name: "pb-render-page-element-dynamic-content",
            type: "pb-render-page-element",
            elementType: "dynamic-content",
            render() {
                return <DynamicElement />;
            }
        } as PbRenderElementPlugin
    ];
};
