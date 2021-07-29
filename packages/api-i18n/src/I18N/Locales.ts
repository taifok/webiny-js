import { I18N } from "~/I18N";
import Error, { NotAuthorizedError, NotFoundError } from "@webiny/error";

import {
    I18NLocale,
    I18NLocalesStorageOperations,
    I18NLocalesStorageOperationsListResponse,
    LocalesCreate,
    LocalesListParams,
    LocalesUpdate,
    LocalesInterface
} from "~/types";
import {
    AfterCreateParams,
    AfterDeleteParams,
    AfterUpdateParams,
    BeforeCreateParams,
    BeforeDeleteParams,
    BeforeUpdateParams
} from "~/plugins/LocalePlugin";

export class Locales implements LocalesInterface {
    private readonly _hooks: Record<string, Function[]>;
    private _storageOperations: I18NLocalesStorageOperations;
    private _i18n: I18N;

    private async runLifecycleEvent(hookName: string, params: Record<string, any>): Promise<void> {
        for (let i = 0; i < this._hooks[hookName].length; i++) {
            const hookCallback = this._hooks[hookName][i];
            await hookCallback(params);
        }
    }

    private _registerHookCallback(hookName, hookCallback) {
        if (!Array.isArray(this._hooks[hookName])) {
            this._hooks[hookName] = [];
        }
        this._hooks[hookName].push(hookCallback);
    }

    constructor(i18n: I18N) {
        this._hooks = {};
        this._i18n = i18n;
    }

    async getDefault(): Promise<I18NLocale> {
        try {
            const locale = await this.getStorageOperations().getDefault();
            if (!locale) {
                throw new NotFoundError(`Default locale not found.`);
            }
            return {
                ...locale,
                createdOn: locale.createdOn ? locale.createdOn : new Date().toISOString()
            };
        } catch (ex) {
            throw new Error(
                ex.message || "Could not load the default locale.",
                ex.code || "LOCALE_DEFAULT_ERROR"
            );
        }
    }

    async get(code: string): Promise<I18NLocale | null> {
        try {
            const locale = await this.getStorageOperations().get(code);
            if (!locale) {
                throw new NotFoundError(`Locale "${code}" not found.`);
            }
            return {
                ...locale,
                createdOn: locale.createdOn ? locale.createdOn : new Date().toISOString()
            };
        } catch (ex) {
            throw new Error(
                ex.message || "Could not load the requested locale.",
                ex.code || "LOCALE_GET_ERROR",
                {
                    code
                }
            );
        }
    }

    async list(params?: LocalesListParams): Promise<I18NLocalesStorageOperationsListResponse> {
        const { where, sort, after, limit = 1000 } = params || {};
        try {
            return await this.getStorageOperations().list({
                where,
                sort: sort && sort.length ? sort : ["createdOn_DESC"],
                after,
                limit
            });
        } catch (ex) {
            throw new Error(
                ex.message || "Could not load the all the locales.",
                ex.code || "LOCALE_LIST_ERROR"
            );
        }
    }

    async create(input: LocalesCreate): Promise<I18NLocale> {
        const security = this._i18n.getSecurity();

        if (security) {
            const permission = await security.getPermission("i18n.locale");

            if (!permission) {
                throw new NotAuthorizedError();
            }
        }

        const original = await this.getStorageOperations().get(input.code);

        if (original) {
            throw new Error(`Locale with key "${original.code}" already exists.`);
        }

        const identity = security.getIdentity();

        const defaultLocale = await this.getStorageOperations().getDefault();

        const locale: I18NLocale = {
            ...input,
            default: input.default === true,
            createdOn: new Date().toISOString(),
            createdBy: {
                id: identity.id,
                displayName: identity.displayName,
                type: identity.type
            },
            tenant: this._i18n.getTenant(),
            webinyVersion: this._i18n.getWebinyVersion()
        };

        try {
            await this.runLifecycleEvent("beforeCreate", {
                data: locale
            });
            const result = await this.getStorageOperations().create({
                locale
            });
            if (locale.default) {
                await this.getStorageOperations().updateDefault({
                    previous: defaultLocale,
                    locale: result
                });
            }
            await this.runLifecycleEvent("afterCreate", {
                data: locale,
                locale: result
            });
            return locale;
        } catch (ex) {
            throw new Error(
                ex.message || "Could not create new locale.",
                ex.code || "LOCALE_CREATE_ERROR",
                {
                    input,
                    locale,
                    defaultLocale
                }
            );
        }
    }

    async update(code: string, input: LocalesUpdate): Promise<I18NLocale> {
        const security = this._i18n.getSecurity();
        if (security) {
            const permission = await security.getPermission("i18n.locale");
            if (!permission) {
                throw new NotAuthorizedError();
            }
        }

        const original = await this.get(code);
        if (!original) {
            throw new NotFoundError(`Locale "${code}" not found.`);
        }
        if (original.default && !input.default) {
            throw new Error(
                "Cannot unset default locale, please set another locale as default first.",
                "CANNOT_CHANGE_DEFAULT_LOCALE",
                {
                    original,
                    input
                }
            );
        }
        const defaultLocale = original.default
            ? original
            : await this.getStorageOperations().getDefault();
        if (!defaultLocale) {
            throw new NotFoundError(`Missing default locale.`);
        }

        const locale: I18NLocale = {
            ...original,
            ...input,
            createdOn: original.createdOn ? original.createdOn : new Date().toISOString(),
            webinyVersion: this._i18n.getWebinyVersion()
        };

        try {
            await this.runLifecycleEvent("beforeUpdate", {
                original,
                data: locale
            });
            const result = await this.getStorageOperations().update({
                original,
                locale
            });
            if (locale.default && original.default !== locale.default) {
                await this.getStorageOperations().updateDefault({
                    previous: defaultLocale,
                    locale
                });
            }
            await this.runLifecycleEvent("afterUpdate", {
                data: locale,
                original,
                locale: result
            });
            return locale;
        } catch (ex) {
            throw new Error(
                ex.message || "Could not update existing locale.",
                ex.code || "LOCALE_UPDATE_ERROR",
                {
                    original,
                    input
                }
            );
        }
    }

    async delete(code: string): Promise<I18NLocale> {
        const security = this._i18n.getSecurity();
        if (security) {
            const permission = await security.getPermission("i18n.locale");
            if (!permission) {
                throw new NotAuthorizedError();
            }
        }

        const locale = await this.get(code);
        if (!locale) {
            throw new NotFoundError(`Locale "${code}" not found.`);
        }

        if (locale.default) {
            throw new Error(
                "Cannot delete default locale, please set another locale as default first."
            );
        }
        const [allLocales] = await this.list();
        if (allLocales.length === 1) {
            throw new Error("Cannot delete the last locale.");
        }
        try {
            await this.runLifecycleEvent("beforeDelete", {
                locale
            });
            await this.getStorageOperations().delete({
                locale
            });
            await this.runLifecycleEvent("afterDelete", {
                locale
            });
            return locale;
        } catch (ex) {
            throw new Error(
                ex.message || "Could not delete existing locale.",
                ex.code || "LOCALE_DELETE_ERROR",
                {
                    locale
                }
            );
        }
    }

    getStorageOperations() {
        return this._storageOperations;
    }

    setStorageOperations(storageOperations: I18NLocalesStorageOperations) {
        this._storageOperations = storageOperations;
        return this;
    }

    beforeCreate(callback: (params: BeforeCreateParams) => void) {
        this._registerHookCallback("beforeCreate", callback);
    }

    afterCreate(callback: (params: AfterCreateParams) => void) {
        this._registerHookCallback("afterCreate", callback);
    }

    beforeUpdate(callback: (params: BeforeUpdateParams) => void) {
        this._registerHookCallback("beforeUpdate", callback);
    }

    afterUpdate(callback: (params: AfterUpdateParams) => void) {
        this._registerHookCallback("afterUpdate", callback);
    }

    beforeDelete(callback: (params: BeforeDeleteParams) => void) {
        this._registerHookCallback("beforeDelete", callback);
    }

    afterDelete(callback: (params: AfterDeleteParams) => void) {
        this._registerHookCallback("afterDelete", callback);
    }
}
