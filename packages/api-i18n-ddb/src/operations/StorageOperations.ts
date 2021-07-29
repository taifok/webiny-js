import { Entity, Table } from "dynamodb-toolbox";
import Error from "@webiny/error";
import { I18N } from "@webiny/api-i18n/I18N";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

interface ConstructorParams {
    i18n: I18N;
    documentClient: DocumentClient;
    table: string;
}

export class StorageOperations {
    protected _i18n: I18N;
    protected _partitionKey: string;
    protected _entity: Entity<any>;
    protected readonly _table: Table;
    protected readonly _extraAttributes = [];

    protected get partitionKey(): string {
        if (!this._partitionKey) {
            const tenant = this._i18n.getTenant();
            if (!tenant) {
                throw new Error("Tenant missing.", "TENANT_NOT_FOUND");
            }
            this._partitionKey = `T#${tenant}#I18N#L`;
        }
        return this._partitionKey;
    }

    protected get defaultPartitionKey(): string {
        return `${this.partitionKey}#D`;
    }

    public constructor({ i18n, documentClient, table }: ConstructorParams) {
        this._i18n = i18n;
        this._table = new Table({
            name: table,
            partitionKey: "PK",
            sortKey: "SK",
            DocumentClient: documentClient
        });
    }
}
