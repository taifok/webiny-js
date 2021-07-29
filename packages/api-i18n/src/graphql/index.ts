import graphql from "./graphql";
import locales from "./graphql/locales";
import installation from "./graphql/installation";
import { ContextPlugin } from "@webiny/handler/plugins/ContextPlugin";
import { I18N } from "~/I18N";
import { ApiI18NContext } from "~/types";

export default () => [
    graphql,
    locales,
    installation,
    new ContextPlugin<ApiI18NContext>(async context => {
        const { http, tenancy, security, plugins, WEBINY_VERSION } = context;
        context.i18n = await new I18N({
            http,
            tenant: tenancy.getCurrentTenant(),
            security,
            plugins,
            webinyVersion: WEBINY_VERSION
        }).init();
    })
];
