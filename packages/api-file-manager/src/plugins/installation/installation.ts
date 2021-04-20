import {
    FileManagerInstallationHooksPlugin,
    FileManagerInstallationPlugin,
    Settings
} from "~/types";
import Error from "@webiny/error";

export default {
    type: "installation",
    name: "installation-fm",
    async install({ srcPrefix }, context) {
        const { fileManager, plugins } = context;
        const version = await fileManager.system.getVersion();

        if (version) {
            throw new Error("File Manager is already installed.", "FILES_INSTALL_ABORTED");
        }

        const data: Partial<Settings> = {};

        if (srcPrefix) {
            data.srcPrefix = srcPrefix;
        }

        await fileManager.settings.createSettings(data);
        await fileManager.system.setVersion(context.WEBINY_VERSION);

        // Process "afterInstall" hook
        const hookPlugins = plugins.byType<FileManagerInstallationHooksPlugin>(
            "installation-fm-hooks"
        );

        for (const pl of hookPlugins) {
            await pl.afterInstall(context);
        }
    }
} as FileManagerInstallationPlugin;
