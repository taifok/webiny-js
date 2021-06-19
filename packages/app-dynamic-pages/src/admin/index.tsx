import gql from "graphql-tag";
import { AddQuerySelectionPlugin } from "@webiny/app/plugins/AddQuerySelectionPlugin";

const dynamicFieldsSelection = gql`
    {
        dynamic
        dataSources
        settings {
            dataSources
        }
    }
`;

export default () => [
    new AddQuerySelectionPlugin({
        operationName: "PbGetPage",
        selectionPath: "pageBuilder.getPage.data",
        addSelection: dynamicFieldsSelection
    }),
    new AddQuerySelectionPlugin({
        operationName: "PbUpdatePage",
        selectionPath: "pageBuilder.updatePage.data",
        addSelection: dynamicFieldsSelection
    }),
    new AddQuerySelectionPlugin({
        operationName: "PbPublishPage",
        selectionPath: "pageBuilder.publishPage.data",
        addSelection: dynamicFieldsSelection
    }),
    new AddQuerySelectionPlugin({
        operationName: "PbUnpublishPage",
        selectionPath: "pageBuilder.unpublishPage.data",
        addSelection: dynamicFieldsSelection
    })
];
