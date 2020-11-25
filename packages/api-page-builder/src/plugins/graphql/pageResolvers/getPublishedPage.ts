import get from "lodash.get";
import { Response, NotFoundResponse, ErrorResponse } from "@webiny/graphql";
import { listPublishedPages } from "./listPublishedPages";
import { loadDataSources } from "./loadDataSources";

const createNotFoundResponse = async ({ returnFallbackPage, context, page, message }) => {
    const { PbPage } = context.models;
    const response = new NotFoundResponse(message);
    if (returnFallbackPage === true) {
        const { PbSettings } = context.models;
        const settings = await PbSettings.load();
        const parent = get(settings, `data.pages.${page}`);
        if (!parent) {
            return response;
        }

        const [foundPage] = await listPublishedPages({
            pageModel: PbPage,
            context,
            args: { parent, limit: 1 }
        });
        response.data = foundPage;
    }

    return response;
};

export default async (root: any, args: { [key: string]: any }, context: { [key: string]: any }) => {
    const { PbSettings, PbPage } = context.models;
    const settings = await PbSettings.load();
    if (!settings.data.installation.completed) {
        // We don't need to load the error page here, since PB is not installed at all, so it doesn't exist.
        return new ErrorResponse({
            code: "PB_NOT_INSTALLED",
            message: "Cannot get published pages, Page Builder is not installed."
        });
    }

    try {
        if (!args.parent && !args.url && !args.id) {
            throw new Error(`Please specify page "id", "parent" or "url".`);
        }

        // 1. If "parent" of "id" were passed, get the page based on those.
        //    Note that the "preview" mode is only available for the "id" filter.
        if (args.parent || args.id) {
            const [page] = await listPublishedPages({
                pageModel: PbPage,
                context,
                args: { ...args, perPage: 1 }
            });
            if (page) {
                return new Response(page);
            }

            return createNotFoundResponse({
                returnFallbackPage: args.returnNotFoundPage,
                context,
                page: "notFound",
                message: "The requested page was not found."
            });
        }

        // 2. Now we are dealing with the "url" filter. If it's set to "/", then load the page set as homepage.
        if (args.url && args.url === "/") {
            const { PbSettings } = context.models;
            const settings = await PbSettings.load();
            const parent = get(settings, `data.pages.home`);

            const [page] = await listPublishedPages({
                pageModel: PbPage,
                context,
                args: { parent, limit: 1 }
            });
            if (page) {
                return new Response(page);
            }

            return createNotFoundResponse({
                returnFallbackPage: args.returnNotFoundPage,
                context,
                page: "notFound",
                message: "The requested page was not found."
            });
        }

        // 3. Otherwise, just try to load the page via passed "url".
        const [page] = await listPublishedPages({
            pageModel: PbPage,
            context,
            args: { ...args, limit: 1 }
        });

        if (page) {
            return new Response(page);
        }

        // 4. As a last resort, find all pages that have a pattern instead of an exact slug
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
                page.dataSources = await loadDataSources(page.settings.dataSources, match.groups);
                // We need to set the `id` to be unique to the matched parameters, not the `page` we loaded from DB
                page.id = JSON.stringify(match.groups);
                return new Response(page);
            }
        }

        return createNotFoundResponse({
            returnFallbackPage: args.returnNotFoundPage,
            context,
            page: "notFound",
            message: "The requested page was not found."
        });
    } catch (e) {
        return createNotFoundResponse({
            returnFallbackPage: args.returnErrorPage,
            context,
            page: "error",
            message: e.message
        });
    }
};
