import React, { useState } from "react";
// import { ApolloProvider } from "@apollo/react-components";
// import { UiProvider } from "@webiny/app/contexts/Ui";
// import { Routes } from "@webiny/app/components/Routes";
// import { I18NProvider } from "@webiny/app-i18n/contexts/I18N";
// import { SecurityProvider } from "@webiny/app-security";
// import { TenancyProvider } from "@webiny/app-security-tenancy/contexts/Tenancy";
// import { CircularProgress } from "@webiny/ui/Progress";
// import { AppInstaller } from "@webiny/app-admin/components/AppInstaller";
// import { CmsProvider } from "@webiny/app-headless-cms/admin/contexts/Cms";
// import { PageBuilderProvider } from "@webiny/app-page-builder/contexts/PageBuilder";
// import { BrowserRouter } from "@webiny/react-router";
// import { Authentication } from "@webiny/app-plugin-security-cognito/Authentication";
// import { createApolloClient } from "./components/apolloClient";
// import { Telemetry } from "./components/Telemetry";
// import { getIdentityData } from "./components/getIdentityData";
//
// // Import styles which include custom theme styles
// import "./App.scss";
// import localImage from "./9ko9x4yvk-003.jpg";

export const App = () => {
    const [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={() => setShow(true)}>Show image</button>
            {show && (
                <div>
                    <img
                        crossOrigin="anonymous"
                        src={"https://d1an0vk1rc3dyd.cloudfront.net/files/9ko9x4yvk-003.jpg"}
                    />
                    {/*<img src={localImage} />*/}
                </div>
            )}
        </div>
    );
};
