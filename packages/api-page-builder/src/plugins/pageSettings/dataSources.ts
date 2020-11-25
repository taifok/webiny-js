import gql from "graphql-tag";
import { object } from "@webiny/commodo";

export default [
    {
        name: "graphql-schema-page-builder-settings-datasources",
        type: "graphql-schema",
        schema: {
            typeDefs: gql`
                extend type PbPageSettings {
                    dataSources: [JSON]
                }

                extend input PbPageSettingsInput {
                    dataSources: [JSON]
                }
            `
        }
    },
    {
        name: "pb-page-settings-datasources",
        type: "pb-page-settings-model",
        apply({ fields: settingsFields }) {
            settingsFields.dataSources = object({
                list: true,
                value: []
            });
        }
    }
];
