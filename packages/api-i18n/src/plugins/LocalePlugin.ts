import { I18NLocale } from "~/types";

/**
 * Parameters for beforeCreate event.
 */
export interface BeforeCreateParams {
    /**
     * Data to be inserted into the storage.
     */
    data: I18NLocale;
}
/**
 * Parameters for afterCreate event.
 */
export interface AfterCreateParams {
    /**
     * Data that was inserted into the storage.
     */
    data: I18NLocale;
    /**
     * Result of the storage operations create method.
     * Possibly changed something on the "data".
     */
    locale: I18NLocale;
}
/**
 * Parameters for beforeUpdate event.
 */
export interface BeforeUpdateParams {
    /**
     * Original locale from the storage.
     */
    original: I18NLocale;
    /**
     * Data to be updated to the storage.
     */
    data: I18NLocale;
}
/**
 * Parameters for afterUpdate event.
 */
export interface AfterUpdateParams {
    /**
     * Original locale from the storage.
     */
    original: I18NLocale;
    /**
     * Data that was updated in the storage.
     */
    data: I18NLocale;
    /**
     * Result of the storage operations update method.
     * Possibly changed something on the "data".
     */
    locale: I18NLocale;
}
/**
 * Parameters for beforeDelete event.
 */
export interface BeforeDeleteParams {
    /**
     * I18NLocale to be deleted from the storage.
     */
    locale: I18NLocale;
}
/**
 * Parameters for afterDelete event.
 */
export interface AfterDeleteParams {
    /**
     * I18NLocale that was deleted from the storage.
     */
    locale: I18NLocale;
}
