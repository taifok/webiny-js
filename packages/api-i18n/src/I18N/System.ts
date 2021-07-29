import { I18N } from "~/I18N";
import Error from "@webiny/error";
import { I18NSystem, I18NSystemStorageOperations, SystemInterface } from "~/types";

export class System implements SystemInterface {
    private _i18n: I18N;
    private _storageOperations: I18NSystemStorageOperations;

    constructor(i18n: I18N) {
        this._i18n = i18n;
    }

    getStorageOperations() {
        return this._storageOperations;
    }

    setStorageOperations(storageOperations: I18NSystemStorageOperations) {
        this._storageOperations = storageOperations;
        return this;
    }

    async getVersion() {
        const system = await this.getStorageOperations().get();
        return system ? system.version : null;
    }

    async setVersion(version) {
        const original = await this.getStorageOperations().get();
        const system: I18NSystem = {
            ...(original || ({} as any)),
            version
        };
        if (original) {
            try {
                await this.getStorageOperations().update({
                    original,
                    system
                });
            } catch (ex) {
                throw new Error(
                    ex.message || "Could not update the system.",
                    ex.code || "SYSTEM_UPDATE_ERROR",
                    {
                        original,
                        system
                    }
                );
            }
            return;
        }
        try {
            await this.getStorageOperations().create({
                system
            });
        } catch (ex) {
            throw new Error(
                ex.message || "Could not create the system.",
                ex.code || "SYSTEM_CREATE_ERROR",
                {
                    version
                }
            );
        }
    }

    async install({ code }) {
        const version = await this._i18n.system.getVersion();
        if (version) {
            throw new Error("I18N is already installed.", "INSTALL_ERROR", {
                version
            });
        }

        await this._i18n.locales.create({
            code,
            default: true
        });

        await this.setVersion(this._i18n.getWebinyVersion());
    }
}
