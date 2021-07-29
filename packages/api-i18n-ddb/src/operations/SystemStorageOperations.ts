import { I18NSystem, I18NSystemStorageOperations } from "@webiny/api-i18n/types";
import Error from "@webiny/error";
import defineSystemEntity from "~/entities/systemEntity";
import { cleanupItem } from "@webiny/db-dynamodb/utils/cleanup";
import { I18N } from "@webiny/api-i18n/I18N";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { StorageOperations } from "~/operations/StorageOperations";

interface ConstructorParams {
    i18n: I18N;
    documentClient: DocumentClient;
    table: string;
}

const SORT_KEY = "I18N";

export class SystemStorageOperations extends StorageOperations
    implements I18NSystemStorageOperations {
    public constructor({ i18n, documentClient, table }: ConstructorParams) {
        super({ i18n, documentClient, table });
        this._entity = defineSystemEntity({
            table: this._table,
            extraAttributes: this._extraAttributes
        });
    }

    public async get(): Promise<I18NSystem> {
        const keys = {
            PK: this.partitionKey,
            SK: SORT_KEY
        };
        try {
            const result = await this._entity.get(keys);

            return cleanupItem(this._entity, result?.Item);
        } catch (ex) {
            throw new Error(
                "Could not load system data from the database.",
                "GET_SYSTEM_ERROR",
                keys
            );
        }
    }

    public async create({ system }): Promise<I18NSystem> {
        const keys = {
            PK: this.partitionKey,
            SK: SORT_KEY
        };
        try {
            await this._entity.put({
                ...keys,
                ...system
            });
            return system;
        } catch (ex) {
            throw new Error(
                "Could not create system data in the database.",
                "CREATE_SYSTEM_ERROR",
                keys
            );
        }
    }

    public async update({ system }): Promise<I18NSystem> {
        const keys = {
            PK: this.partitionKey,
            SK: SORT_KEY
        };
        try {
            await this._entity.put({
                ...keys,
                ...system
            });
            return system;
        } catch (ex) {
            throw new Error(
                "Could not update system data in the database.",
                "UPDATE_VERSION_ERROR",
                keys
            );
        }
    }
}
