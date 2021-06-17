import { useEffect } from "react";
import { gql } from "graphql-tag";
import {
    DataSourceLoaderPlugin,
    Props
} from "@webiny/app-dynamic-pages/editor/plugins/DataSourcePlugin";
import { useCms } from "@webiny/app-headless-cms/admin/hooks";

const parseValue = (type, value) => {
    switch (type) {
        case "Number":
            return value.includes(".") ? parseFloat(value) : parseInt(value);
        case "Float":
            return parseFloat(value);
        case "Long":
        case "Int":
            return parseInt(value);
        default:
            return value;
    }
};

interface Variable {
    name: string;
    previewValue: string;
    required: boolean;
    type: string;
    value: string;
}

interface DataSourceConfig {
    query: string;
    url: string;
    variables: Variable[];
}

export class GetEntryLoaderPlugin extends DataSourceLoaderPlugin<DataSourceConfig> {
    getComponent(): React.ComponentType<Props<DataSourceConfig>> {
        return ({ onLoad }) => {
            const { createApolloClient } = useCms();

            useEffect(() => {
                return onLoad("cms-get-entry", async ds => {
                    const client = createApolloClient({ uri: ds.config.url });

                    const variables = {};
                    for (const v of ds.config.variables) {
                        if (!v.previewValue || v.previewValue === "") {
                            throw new Error(`Missing preview value for variable "${v.name}"!`);
                        }
                        variables[v.name] = parseValue(v.type, v.previewValue);
                    }

                    const { data } = await client.query({
                        query: gql(ds.config.query),
                        variables
                    });

                    return data;
                });
            }, []);
            return null;
        };
    }
}
