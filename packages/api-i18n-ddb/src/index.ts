import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { I18NPlugin } from "@webiny/api-i18n/plugins/I18NPlugin";
import { LocalesStorageOperations } from "./operations/LocalesStorageOperations";
import { SystemStorageOperations } from "./operations/SystemStorageOperations";

interface Config {
    documentClient?: DocumentClient;
    table?: string;
}

export default ({ documentClient, table }: Config = {}) => [
    new I18NPlugin(i18n => {
        i18n.locales.setStorageOperations(new LocalesStorageOperations({ i18n, documentClient, table }));
        i18n.system.setStorageOperations(new SystemStorageOperations({ i18n, documentClient, table }));
    })
];
