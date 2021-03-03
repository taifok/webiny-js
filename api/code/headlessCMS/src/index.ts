import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createHandler } from "@webiny/handler-aws";
import i18nPlugins from "@webiny/api-i18n/graphql";
import i18nContentPlugins from "@webiny/api-i18n-content/plugins";
import dbPlugins from "@webiny/handler-db";
import { DynamoDbDriver } from "@webiny/db-dynamodb";
import elasticSearch from "@webiny/api-plugin-elastic-search-client";
import headlessCmsPlugins from "@webiny/api-headless-cms/content";
import securityPlugins from "./security";
import prerenderingServiceClientPlugins from "@webiny/api-prerendering-service/client";
import pbPrerenderingClientPlugins from "@webiny/api-page-builder/prerenderingClient";
import headlessCmsPrerenderingPlugins from "@webiny/api-headless-cms-prerendering/headlessCms";

export const handler = createHandler(
    elasticSearch({ endpoint: `https://${process.env.ELASTIC_SEARCH_ENDPOINT}` }),
    dbPlugins({
        table: process.env.DB_TABLE,
        driver: new DynamoDbDriver({
            documentClient: new DocumentClient({
                convertEmptyValues: true,
                region: process.env.AWS_REGION
            })
        })
    }),
    securityPlugins(),
    i18nPlugins(),
    i18nContentPlugins(),
    headlessCmsPlugins({ debug: Boolean(process.env.DEBUG) }),
    prerenderingServiceClientPlugins({
        handlers: {
            render: process.env.PRERENDERING_RENDER_HANDLER,
            flush: process.env.PRERENDERING_FLUSH_HANDLER,
            queue: {
                add: process.env.PRERENDERING_QUEUE_ADD_HANDLER,
                process: process.env.PRERENDERING_QUEUE_PROCESS_HANDLER
            }
        }
    }),
    pbPrerenderingClientPlugins(),
    headlessCmsPrerenderingPlugins()
);
