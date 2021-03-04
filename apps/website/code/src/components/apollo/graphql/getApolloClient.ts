import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createOmitTypenameLink } from "@webiny/app/graphql";

let client;

export default () => {
    if (client) {
        return client;
    }

    const cache = new InMemoryCache({
        addTypename: true,
        dataIdFromObject: obj => obj.id || null
    });

    const uri = process.env.REACT_APP_API_URL + "/graphql";
    const link = ApolloLink.from([
        createOmitTypenameLink(),
        new BatchHttpLink({ uri })
    ]);

    client = new ApolloClient({ link, cache });
    return client;
};
