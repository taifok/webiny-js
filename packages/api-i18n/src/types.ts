import { ClientContext } from "@webiny/handler-client/types";
import { ContextInterface } from "@webiny/handler/types";
import { TenancyContext } from "@webiny/api-tenancy/types";
import { I18N } from "~/I18N";
import { SecurityContext } from "@webiny/api-security/types";

// Handler context types.
export interface I18NContext {
    i18n: I18N;
}

export interface ApiI18NContext
    extends ContextInterface,
        ClientContext,
        SecurityContext,
        TenancyContext,
        I18NContext {}

// Entity types.
export interface I18NLocale {
    code: string;
    default: boolean;
    createdOn: string;
    createdBy: {
        id: string;
        displayName: string;
        type: string;
    };
    tenant: string;
    webinyVersion: string;
}

export interface I18NSystem {
    version: string;
}

// System class types.
/**
 * Definition for the system part crud of the i18n.
 */
export interface SystemInterface {
    /**
     * Get the current version of the i18n.
     */
    getVersion(): Promise<string>;
    /**
     * Set the current version of the i18n.
     */
    setVersion(version: string): Promise<void>;
    /**
     * Run the install process for the i18n.
     */
    install(params: SystemInstallParams): Promise<void>;
}

export interface SystemInstallParams {
    code: string;
}

// Locales class types.

/**
 * Definition for the locales part crud of the i18n.
 */
export interface LocalesInterface {
    /**
     * Get the default locale.
     */
    getDefault: () => Promise<I18NLocale>;
    /**
     * Get the locale by given code.
     */
    get: (code: string) => Promise<I18NLocale>;
    /**
     * List all locales in the storage.
     */
    list: (params?: LocalesListParams) => Promise<I18NLocalesStorageOperationsListResponse>;
    /**
     * Create a new locale.
     */
    create: (data: LocalesCreate) => Promise<I18NLocale>;
    /**
     * Update the locale with new data.
     */
    update: (code: string, data: LocalesUpdate) => Promise<I18NLocale>;
    /**
     * Delete the given locale by code.
     */
    delete: (code: string) => Promise<I18NLocale>;
}

/**
 * Data for the new locale.
 */
export interface LocalesCreate {
    code: string;
    default?: boolean;
}

/**
 * Data to be updated in the given locale.
 */

export interface LocalesUpdate {
    default: boolean;
}

export interface LocalesListParams {
    where?: {
        code?: string;
        default?: boolean;
        [key: string]: any;
    };
    sort?: string[];
    limit?: number;
    after?: string;
}

// Storage operations types - locales.
export interface I18NLocalesStorageOperationsListParams {
    where?: {
        code?: string;
        default?: boolean;
        createdBy?: string;
        createdOn?: string;
        createdOn_not?: string;
        createdOn_not_in?: string[];
        createdOn_lt?: string;
        createdOn_lte?: string;
        createdOn_gt?: string;
        createdOn_gte?: string;
    };
    limit?: number;
    after?: string;
    sort?: string[];
}

export interface I18NLocalesStorageOperationsListResponseMeta {
    hasMoreItems: boolean;
    totalCount: number;
    cursor: string;
}

export type I18NLocalesStorageOperationsListResponse = [
    I18NLocale[],
    I18NLocalesStorageOperationsListResponseMeta
];

export interface I18NLocalesStorageOperationsCreateParams {
    locale: I18NLocale;
}

export interface I18NLocalesStorageOperationsUpdateParams {
    original: I18NLocale;
    locale: I18NLocale;
}

export interface I18NLocalesStorageOperationsUpdateDefaultParams {
    /**
     * The current default locale, possibly null if its the first insert into the storage..
     */
    previous?: I18NLocale | null;
    /**
     * Locale to set as the default one.
     */
    locale: I18NLocale;
}

export interface I18NLocalesStorageOperationsDeleteParams {
    locale: I18NLocale;
}

export interface I18NLocalesStorageOperations {
    getDefault: () => Promise<I18NLocale>;
    get: (code: string) => Promise<I18NLocale | null>;
    list: (
        params?: I18NLocalesStorageOperationsListParams
    ) => Promise<I18NLocalesStorageOperationsListResponse>;
    create: (params: I18NLocalesStorageOperationsCreateParams) => Promise<I18NLocale>;
    update: (params: I18NLocalesStorageOperationsUpdateParams) => Promise<I18NLocale>;
    updateDefault: (params: I18NLocalesStorageOperationsUpdateDefaultParams) => Promise<I18NLocale>;
    delete: (params: I18NLocalesStorageOperationsDeleteParams) => Promise<void>;
}

// Storage operations types - system.
export interface I18NSystemStorageOperationsCreate {
    system: I18NSystem;
}

export interface I18NSystemStorageOperationsUpdate {
    original: I18NSystem;
    system: I18NSystem;
}

export interface I18NSystemStorageOperations {
    get: () => Promise<I18NSystem>;
    create: (input: I18NSystemStorageOperationsCreate) => Promise<I18NSystem>;
    update: (input: I18NSystemStorageOperationsUpdate) => Promise<I18NSystem>;
}
