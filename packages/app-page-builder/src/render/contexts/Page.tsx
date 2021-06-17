import React from "react";
import { PbPageData } from "~/types";

export const PageContext = React.createContext(null);

type PageProviderProps = {
    page: PbPageData;
    children: React.ReactNode;
};

export const PageProvider = (props: PageProviderProps) => {
    return <PageContext.Provider value={props.page}>{props.children}</PageContext.Provider>;
};
