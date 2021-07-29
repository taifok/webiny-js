import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createHandler } from "@webiny/handler-aws";
import installationPlugins from "@webiny/api-i18n/installation";
import i18nDynamoDbStorageOperations from "@webiny/api-i18n-ddb";

// Use this approach (factories with documentClient sent as arg)
const documentClient = new DocumentClient({
    convertEmptyValues: true,
    region: process.env.AWS_REGION
});

export const handler = createHandler(
    i18nDynamoDbStorageOperations({
        documentClient,
        table: process.env.DB_TABLE,
    }),
    installationPlugins()
);
