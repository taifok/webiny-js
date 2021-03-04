import React from "react";
import { BrowserRouter, Switch, Route } from "@webiny/react-router";

// We don't rely on Page Builder, that's why we commented it out here.
// import { PageBuilderProvider } from "@webiny/app-page-builder/contexts/PageBuilder";
// import Page from "./components/Page";

// This is our Location component.
import Location from "./components/Location";
import CreateLocation from "./components/CreateLocation";

export const App = () => (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
            <Route path={"/locations/create"} component={CreateLocation} />
            <Route path={"*"} component={Location} />
        </Switch>
    </BrowserRouter>
);
