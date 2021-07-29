import { Entity, Table } from "dynamodb-toolbox";

interface Params {
    table: Table;
    extraAttributes: Array<any>;
}

export default ({ table, extraAttributes }: Params): Entity<any> => {
    const entityName = "I18NSystem";
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
            version: {
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
