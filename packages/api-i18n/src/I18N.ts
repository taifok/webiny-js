import { Tenant } from "@webiny/api-tenancy/types";
import { Locales } from "./I18N/Locales";
import { System } from "./I18N/System";
import { SecurityContextBase } from "@webiny/api-security/types";
import { PluginsContainer } from "@webiny/plugins";
import acceptLanguageParser from "accept-language-parser";
import { HttpObject } from "@webiny/handler-http/types";
import { I18NPlugin } from "~/plugins/I18NPlugin";

// TODO: need to have the Security class here. SecurityContextBase is just used temporarily, for the interface.
type Security = SecurityContextBase;

export interface I18NConfig {
    tenant: Tenant;
    security?: Security;
    plugins?: PluginsContainer;
    http?: HttpObject;
    locale?: string;
    webinyVersion: string;
}

export type LocalesResolver = (i18n: I18N) => Array<{}> | Promise<Array<{}>>;

export type LocaleContext = {
    name: string;
};

async function defaultLocalesResolver(i18n) {
    const [items] = await i18n.locales.list();
    return items.map(locale => ({
        code: locale.code,
        default: locale.default
    }));
}

export class I18N {
    private _config: I18NConfig;
    private _i18n: any;
    private _localesResolver: LocalesResolver;
    private _localeContexts: LocaleContext[];
    public locales: Locales;
    public system: System;

    constructor(config: I18NConfig) {
        this._config = config;
        this._localesResolver = defaultLocalesResolver;
        this._localeContexts = [{ name: "default" }, { name: "content" }];

        this._i18n = {
            acceptLanguage: null,
            defaultLocale: null,
            locale: {}, // Contains one or more locales - for multiple locale contexts.
            locales: []
        };
        this.locales = new Locales(this);
        this.system = new System(this);
    }

    async init() {
        const plugins = this.getPlugins().byType<I18NPlugin>(I18NPlugin.type);
        for (let i = 0; i < plugins.length; i++) {
            await plugins[i].apply(this);
        }

        const localesResolver = this.getLocalesResolver();
        this._i18n.locales = await localesResolver(this);
        return this;
    }

    getTenant() {
        return this._config.tenant.id;
    }

    getSecurity() {
        return this._config.security;
    }

    getPlugins() {
        return this._config.plugins;
    }

    getWebinyVersion() {
        return this._config.webinyVersion;
    }

    getHttp() {
        return this._config.http;
    }

    setLocalesResolver(resolver: LocalesResolver): I18N {
        this._localesResolver = resolver;
        return this;
    }

    getLocalesResolver(): LocalesResolver {
        return this._localesResolver;
    }

    setLocaleContexts(localeContexts: LocaleContext[]): I18N {
        this._localeContexts = localeContexts;
        return this;
    }

    getLocaleContexts(): LocaleContext[] {
        return this._localeContexts;
    }

    getDefaultLocale = () => {
        const allLocales = this.getLocales();
        return allLocales.find(item => item.default === true);
    };

    getCurrentLocales = () => {
        const localeContexts = this.getLocaleContexts();
        return localeContexts.map(context => ({
            context: context.name,
            locale: this.getCurrentLocale(context.name)?.code
        }));
    };

    getCurrentLocale = (localeContext = "default") => {
        if (this._i18n.locale[localeContext]) {
            return this._i18n.locale[localeContext];
        }

        const allLocales = this.getLocales();

        let currentLocale;

        if (this._config.locale) {
            currentLocale = allLocales.find(item => item.code === this._config.locale);
        } else {
            const http = this.getHttp();
            if (http) {
                const { acceptLanguageHeader, contextLocaleHeader } = getLocaleFromHeaders(
                    http,
                    localeContext
                );

                // Try to select from received context locale.
                let localeFromHeaders = contextLocaleHeader;
                if (!localeFromHeaders && acceptLanguageHeader) {
                    localeFromHeaders = acceptLanguageParser.pick(
                        allLocales.map(item => item.code),
                        acceptLanguageHeader
                    );
                }

                if (localeFromHeaders) {
                    currentLocale = allLocales.find(item => item.code === localeFromHeaders);
                }
            }
        }

        if (!currentLocale) {
            currentLocale = this.getDefaultLocale();
        }

        this._i18n.locale[localeContext] = currentLocale;

        return this._i18n.locale[localeContext];
    };

    getLocales = () => {
        return this._i18n.locales;
    };

    getLocale = code => {
        const item = this._i18n.locales.find(
            locale => locale.code.toLowerCase() === code.toLowerCase()
        );
        if (!item) {
            return null;
        }
        return item;
    };
}

/**
 * Parses "x-i18n-locale" header value (e.g. "default:en-US;content:hr-HR;").
 */
const parseXI18NLocaleHeader = value => {
    if (parseXI18NLocaleHeader.cache[value]) {
        return parseXI18NLocaleHeader.cache[value];
    }

    /**
     * Parsing x-i18n-locale value (e.g. "default:en-US;content:hr-HR;").
     */
    parseXI18NLocaleHeader.cache[value] = value
        .split(";")
        .filter(Boolean)
        .map(item => item.split(":"))
        .reduce((current, [context, locale]) => {
            current[context] = locale;
            return current;
        }, {});

    return parseXI18NLocaleHeader.cache[value];
};

parseXI18NLocaleHeader.cache = {};

const getLocaleFromHeaders = (http, localeContext = "default") => {
    if (!http) {
        return null;
    }

    const { headers = {} } = http.request;

    let acceptLanguageHeader, contextLocaleHeader;
    for (const key in headers) {
        if (headers.hasOwnProperty(key) === false) {
            continue;
        }
        const lcKey = key.toLowerCase();
        if (lcKey === "accept-language") {
            acceptLanguageHeader = headers[key];
        } else if (lcKey === "x-i18n-locale") {
            const parsed = parseXI18NLocaleHeader(headers[key]);
            contextLocaleHeader = parsed[localeContext];
        }

        if (acceptLanguageHeader && contextLocaleHeader) {
            break;
        }
    }

    return { acceptLanguageHeader, contextLocaleHeader };
};
