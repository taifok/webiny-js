import { Entity, Table } from "dynamodb-toolbox";

interface Params {
    table: Table;
    extraAttributes: Array<any>;
}

export default ({ table, extraAttributes }: Params): Entity<any> => {
    const entityName = "I18NLocale";

    return new Entity({
        name: entityName,
        table,
        attributes: {
            PK: {
                partitionKey: true
            },
            SK: {
                sortKey: true
            },
            createdOn: {
                type: "string"
            },
            createdBy: {
                type: "map"
            },
            code: {
                type: "string"
            },
            default: {
                type: "boolean"
            },
            webinyVersion: {
                type: "string"
            },
            tenant: {
                type: "string"
            },
            ...extraAttributes.reduce((attributes, plugin) => {
                // TODO: finish this
                return {
                    ...attributes,
                    ...plugin.getDefinition()
                };
            }, {})
        }
    });
};
