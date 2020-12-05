import { listPublishedPages } from "@webiny/api-page-builder/plugins/graphql/pageResolvers/listPublishedPages";
import { loadDataSources } from "./loadDataSources";

export default () => {
    return {
        type: "pb-page-not-found",
        async resolve(root, args, context) {
            const { PbPage } = context.models;
            
            // Find all pages that have a pattern instead of an exact slug
            const pages = await listPublishedPages({
                pageModel: PbPage,
                context,
                args: { pattern: true, limit: 100 }
            });

            // Try matching the requested URL against dynamic page patterns
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                let pattern = page.url;
                const placeholders: string[] = Array.from(pattern.matchAll(/\{([a-zA-Z]+)\}/g));
                for (let j = 0; j < placeholders.length; j++) {
                    const [find, replace] = placeholders[j];
                    pattern = pattern.replace(find, `(?<${replace}>(.+))`);
                }
                // Try matching
                const match = args.url.match(new RegExp(pattern));
                if (match) {
                    // Load data sources
                    page.dataSources = await loadDataSources(
                        page.settings.dataSources,
                        match.groups
                    );
                    // We need to set the `id` to be unique to the matched parameters, not the `page` we loaded from DB
                    page.id = JSON.stringify(match.groups);
                    return page;
                }
            }
        }
    };
};
