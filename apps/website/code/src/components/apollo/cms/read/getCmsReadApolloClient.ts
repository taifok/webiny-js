import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createOmitTypenameLink } from "@webiny/app/graphql";
import { plugins } from "@webiny/plugins";

// Loaded in apps/website/code/webiny.config.js.
const CMS_API_TOKEN = process.env.CMS_API_TOKEN;

let client;

export default () => {
    if (client) {
        return client;
    }

    const isProduction = process.env.NODE_ENV === "production";

    const cache = new InMemoryCache({
        addTypename: true,
        dataIdFromObject: obj => obj.id || null
    });

    if (isProduction && process.env.REACT_APP_ENV === "browser") {
        // Production build of this app will be rendered using SSR so we need to restore cache from pre-rendered state.
        // @ts-ignore
        cache.restore(window.__APOLLO_STATE__);
    }

    // @ts-ignore
    cache.restore("__APOLLO_STATE__" in window ? window.__APOLLO_STATE__ : {});

    const authLink = new ApolloLink((operation, forward) => {
        // Use the setContext method to set the HTTP headers.
        operation.setContext({
            headers: {
                authorization: `Bearer ${CMS_API_TOKEN}`
            }
        });

        // Call the next link in the middleware chain.
        return forward(operation);
    });

    const uri = process.env.REACT_APP_API_URL + "/cms/read/en-US";
    const link = ApolloLink.from([
        createOmitTypenameLink(),
        ...plugins.byType("apollo-link").map(pl => pl.createLink()),
        new BatchHttpLink({ uri }),
        authLink
    ]);

    // @ts-ignore
    window.getApolloState = () => {
        // @ts-ignore
        return cache.data.data;
    };

    client = new ApolloClient({ link, cache });
    return client;
};
