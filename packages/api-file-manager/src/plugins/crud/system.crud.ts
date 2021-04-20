import { NotAuthorizedError } from "@webiny/api-security";
import { getApplicablePlugin } from "@webiny/api-upgrade";
import { UpgradePlugin } from "@webiny/api-upgrade/types";
import { FileManagerContext, FileManagerInstallationPlugin, SystemCRUD } from "~/types";
import defaults from "./utils/defaults";

export default (context: FileManagerContext): SystemCRUD => {
    const { security, plugins } = context;

    const keys = () => ({ PK: `T#${security.getTenant().id}#SYSTEM`, SK: "FM" });

    return {
        async getVersion() {
            const { db, fileManager } = context;

            const [[system]] = await db.read({
                ...defaults.db,
                query: keys()
            });

            // Backwards compatibility check
            if (!system) {
                // If settings exist, it means this system was installed before versioning was introduced.
                // 5.0.0-beta.4 is the last version before versioning was introduced.
                const settings = await fileManager.settings.getSettings();
                return settings ? "5.0.0-beta.4" : null;
            }

            return system.version;
        },
        async setVersion(version: string) {
            const { db } = context;

            const [[system]] = await db.read({
                ...defaults.db,
                query: keys()
            });

            if (system) {
                await db.update({
                    ...defaults.db,
                    query: keys(),
                    data: {
                        version
                    }
                });
            } else {
                await db.create({
                    ...defaults.db,
                    data: {
                        ...keys(),
                        version
                    }
                });
            }
        },
        async install({ srcPrefix }) {
            const installation = plugins.byName<FileManagerInstallationPlugin>("installation-fm");
            
            await installation.install({ srcPrefix }, context);
            
            return true;
        },
        async upgrade(version) {
            const identity = context.security.getIdentity();
            if (!identity) {
                throw new NotAuthorizedError();
            }

            const upgradePlugins = plugins
                .byType<UpgradePlugin>("api-upgrade")
                .filter(pl => pl.app === "file-manager");

            const plugin = getApplicablePlugin({
                deployedVersion: context.WEBINY_VERSION,
                installedAppVersion: await this.getVersion(),
                upgradePlugins,
                upgradeToVersion: version
            });

            await plugin.apply(context);

            // Store new app version
            await this.setVersion(version);

            return true;
        }
    };
};
