import React from "react";
import { PbEditorPageSettingsPlugin } from "@webiny/app-page-builder/plugins/PbEditorPageSettingsPlugin";
import { ReactComponent as HeadlessCmsIcon } from "./icons/devices_other-black-24px.svg";
import HeadlessDataSourcesSettings from "./pageSettings/components/headlessDataSource/DataSourcesSettings";
import { GetEntryLoaderPlugin } from "./GetEntryLoaderPlugin";

export default () => [
    new PbEditorPageSettingsPlugin({
        title: "Headless CMS data source",
        description: "Generate a page using Headless CMS data.",
        icon: <HeadlessCmsIcon />,
        render(props) {
            return <HeadlessDataSourcesSettings {...props} />;
        }
    }),
    new GetEntryLoaderPlugin()
];
