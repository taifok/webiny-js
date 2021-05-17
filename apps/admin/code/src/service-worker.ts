/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({ request, url }: { request: Request; url: URL }) => {
        // If this isn't a navigation, skip.
        if (request.mode !== "navigate") {
            return false;
        }

        // If this is a URL that starts with /_, skip.
        if (url.pathname.startsWith("/_")) {
            return false;
        }

        // If this looks like a URL for a resource, because it contains
        // a file extension, skip.
        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        }

        // Return true to signal that we want to use the handler.
        return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", event => {
    console.log("SW GOT MESSAGE", event);
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

// Any other custom service worker logic can go here.

// registerRoute(/files/, new PrivateFilesStrategy());
// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .jpg requests like those from in public/
registerRoute(
    // Add in any other file extensions or routing criteria as needed.
    ({ url }) => {
        return url.pathname.endsWith(".jpg");
    },
    // Customize this strategy as needed, e.g., by changing to CacheFirst.
    async ({ request }) => {
        const headers = new Headers();
        headers.append("Content-Type", "image/jpeg");
        headers.append("Authorization", "JWT TOKEN!");

        return fetch(request.url, {
            headers,
            mode: "cors",
            credentials: "omit"
        });
    }
);
