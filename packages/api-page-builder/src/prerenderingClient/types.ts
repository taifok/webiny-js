import { Context, ContextPlugin } from "@webiny/handler/types";
import { DbContext } from "@webiny/handler-db/types";
import { TenancyContext } from "@webiny/api-security-tenancy/types";
import { I18NContentContext } from "@webiny/api-i18n-content/types";
import { PrerenderingServiceClientContext } from "@webiny/api-prerendering-service/client/types";
import { FlushArgs, RenderArgs } from "../graphql/types";

export type PrerenderingClientContext = Context<
    PrerenderingServiceClientContext,
    DbContext,
    TenancyContext,
    I18NContentContext,
    {
        pageBuilder: {
            prerenderingClient: {
                settings: any;
                render(args: RenderArgs): Promise<void>;
                flush(args: FlushArgs): Promise<void>;
            };
        };
    }
>;

export type PrerenderingClientContextPlugin = ContextPlugin<PrerenderingClientContext>;
