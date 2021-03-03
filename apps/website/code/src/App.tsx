import React from "react";
import { ApolloProvider } from "@apollo/react-components";
import { BrowserRouter, Switch, Route } from "@webiny/react-router";

// We don't rely on Page Builder, that's why we commented it out here.
// import { PageBuilderProvider } from "@webiny/app-page-builder/contexts/PageBuilder";
// import Page from "./components/Page";

// This is our Location component.
import Location from "./components/Location";

import { createApolloClient } from "./components/apolloClient";

export const App = () => (
    <ApolloProvider client={createApolloClient()}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route path={"*"} component={Location} />
            </Switch>
        </BrowserRouter>
    </ApolloProvider>
);
