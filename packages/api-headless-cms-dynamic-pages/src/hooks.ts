// @ts-nocheck
import { PagePlugin } from "../../api-page-builder/src/plugins/PagePlugin";

export default new PagePlugin({
    async afterPublish({ context, page, publishedPage }) {
        if (!publishedPage.dynamic) {
            return;
        }

        // TODO: if URL changes, we need to flush cache for old URL, and render everything with new URL 🤯

        // TODO: execute `get-entries` GQL query, and generate a list of URLs to render.
        const urls = [];

        await context.pageBuilder.pages.prerendering.render({
            paths: urls.map(url => ({ path: url }))
        });
    },
    async afterDelete({ context, page }) {
        // TODO: generate list of all potential page URLs
        // TODO: flush all pages with this template URL
    },
    async afterUnpublish({ context, page }) {
        // TODO: generate list of all potential page URLs
        // TODO: flush all pages with this template URL
    }
});
