import { I18NPlugin } from "~/plugins/I18NPlugin";

export const locales = {
    en: {
        code: "en-US",
        default: true
    },
    de: {
        code: "de-DE",
        default: false
    },
    it: {
        code: "it-IT",
        default: false
    }
};

export const mockLocalesPlugins = new I18NPlugin(i18n => {
    i18n.setLocalesResolver(() => Object.values(locales));
});
