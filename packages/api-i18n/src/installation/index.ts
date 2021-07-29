import Error from "@webiny/error";
import { HandlerPlugin } from "@webiny/handler/plugins/HandlerPlugin";
import { ArgsContext } from "@webiny/handler-args/types";
import { I18N } from "~/I18N";
import { Tenant } from "@webiny/api-tenancy/types";

export type HandlerArgs = {
    data: {
        defaultLocale: string;
        tenant: Tenant;
    };
};

const handler = new HandlerPlugin<ArgsContext<HandlerArgs>>(async context => {
    const { invocationArgs } = context;
    const { tenant, defaultLocale } = invocationArgs;

    const i18n = new I18N({
        tenant,
        plugins: context.plugins,
        webinyVersion: context.WEBINY_VERSION
    });

    const version = await i18n.system.getVersion();
    if (version) {
        throw new Error("I18N is already installed.", "INSTALL_ERROR", {
            version
        });
    }

    await i18n.locales.create({
        code: defaultLocale,
        default: true
    });

    await i18n.system.setVersion(context.WEBINY_VERSION);
});

export default () => [handler];
