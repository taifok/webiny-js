import { PrerenderingClientContextPlugin } from "./types";
import trimStart from "lodash/trimStart";
import merge from "lodash/merge";
import defaults from "./../utils/defaults";
import { DefaultSettings } from "../types";

import getPKPrefix from "./getPKPrefix";

export default () => {
    return [
        {
            type: "context",
            apply(context) {
                const { db } = context;

                context.pageBuilder = {
                    ...context.pageBuilder,
                    prerenderingClient: {
                        settings: {
                            PK: options => {
                                const prefix = getPKPrefix(context, options);
                                return `${prefix}SETTINGS`;
                            },
                            SK: "default",
                            async get(options) {
                                const [[result]] =  await db.read<DefaultSettings>({
                                    ...defaults.db,
                                    query: { PK: this.PK(options), SK: this.SK },
                                    limit: 1
                                });

                                return result;
                            },
                            async getDefault(options) {
                                const allTenants = await this.get({ tenant: false, locale: false });
                                const tenantAllLocales = await this.get({
                                    tenant: options?.tenant,
                                    locale: false
                                });
                                if (!allTenants && !tenantAllLocales) {
                                    return null;
                                }

                                return merge({}, allTenants, tenantAllLocales);
                            }
                        },
                        async render(args) {
                            const current = await context.pageBuilder.prerenderingClient.settings.get();
                            const defaults = await context.pageBuilder.prerenderingClient.settings.getDefault();

                            console.log("current", current);
                            console.log("defaults", defaults);
                            const appUrl =
                                current?.prerendering?.app?.url || defaults?.prerendering?.app?.url;

                            const storageName =
                                current?.prerendering?.storage?.name ||
                                defaults?.prerendering?.storage?.name;

                            if (!appUrl || !storageName) {
                                return;
                            }

                            const meta = merge(
                                defaults?.prerendering?.meta,
                                current?.prerendering?.meta
                            );

                            const { paths, tags } = args;

                            const dbNamespace = "T#" + context.security.getTenant().id;

                            if (Array.isArray(paths)) {
                                await context.prerenderingServiceClient.render(
                                    paths.map(item => ({
                                        url: appUrl + item.path,
                                        configuration: merge(
                                            {
                                                meta,
                                                storage: {
                                                    folder: trimStart(item.path, "/"),
                                                    name: storageName
                                                },
                                                db: {
                                                    namespace: dbNamespace
                                                }
                                            },
                                            item.configuration
                                        )
                                    }))
                                );
                            }

                            if (Array.isArray(tags)) {
                                await context.prerenderingServiceClient.queue.add(
                                    tags.map(item => ({
                                        render: {
                                            tag: item.tag,
                                            configuration: merge(
                                                {
                                                    db: {
                                                        namespace: dbNamespace
                                                    }
                                                },
                                                item.configuration
                                            )
                                        }
                                    }))
                                );
                            }
                        },

                        async flush(args) {
                            const current = await context.pageBuilder.prerenderingClient.settings.get();
                            const defaults = await context.pageBuilder.prerenderingClient.settings.getDefault();

                            const appUrl =
                                current?.prerendering?.app?.url || defaults?.prerendering?.app?.url;

                            const storageName =
                                current?.prerendering?.storage?.name ||
                                defaults?.prerendering?.storage?.name;

                            if (!storageName) {
                                return;
                            }

                            const { paths, tags } = args;

                            const dbNamespace = "T#" + context.security.getTenant().id;

                            if (Array.isArray(paths)) {
                                await context.prerenderingServiceClient.flush(
                                    paths.map(p => ({
                                        url: appUrl + p.path,
                                        // Configuration is mainly static (defined here), but some configuration
                                        // overrides can arrive via the call args, so let's do a merge here.
                                        configuration: merge(
                                            {
                                                db: {
                                                    namespace: dbNamespace
                                                }
                                            },
                                            p.configuration
                                        )
                                    }))
                                );
                            }

                            if (Array.isArray(tags)) {
                                await context.prerenderingServiceClient.queue.add(
                                    tags.map(item => ({
                                        flush: {
                                            tag: item.tag,
                                            configuration: merge(
                                                {
                                                    db: {
                                                        namespace: dbNamespace
                                                    }
                                                },
                                                item.configuration
                                            )
                                        }
                                    }))
                                );
                            }
                        }
                    }
                };
            }
        } as PrerenderingClientContextPlugin
    ];
};
