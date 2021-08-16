import React from "react";
import ApolloClient from "apollo-client";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import { CircularProgress } from "@webiny/ui/Progress";
import { HeadlessCMS } from "~/admin/contexts/Cms/HeadlessCMS";

export interface CmsContextValue {
    app: HeadlessCMS;
    getApolloClient(locale: string): ApolloClient<any>;
    createApolloClient: CmsProviderProps["createApolloClient"];
    apolloClient: ApolloClient<any>;
}

export const CmsContext = React.createContext<CmsContextValue>(null);

const apolloClientsCache = {};

type CmsProviderProps = {
    createApolloClient: (params: { uri: string }) => ApolloClient<any>;
    children: React.ReactNode;
};

export function CmsProvider(props: CmsProviderProps) {
    const { getCurrentLocale } = useI18N();

    const currentLocale = getCurrentLocale("content");

    if (currentLocale && !apolloClientsCache[currentLocale]) {
        apolloClientsCache[currentLocale] = props.createApolloClient({
            uri: `${process.env.REACT_APP_API_URL}/cms/manage/${currentLocale}`
        });
    }

    const value = {
        app: new HeadlessCMS(),
        getApolloClient(locale: string) {
            if (!apolloClientsCache[locale]) {
                apolloClientsCache[locale] = props.createApolloClient({
                    uri: `${process.env.REACT_APP_API_URL}/cms/manage/${locale}`
                });
            }
            return apolloClientsCache[locale];
        },
        createApolloClient: props.createApolloClient,
        apolloClient: apolloClientsCache[currentLocale]
    };

    if (!currentLocale) {
        return <CircularProgress />;
    }

    return <CmsContext.Provider value={value} {...props} />;
}
