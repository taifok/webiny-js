import * as React from "react";
import { PbPageDataSource } from "../../types";

export const PageDataSourcesContext = React.createContext(null);

export type PageDataSourcesContextValue = PbPageDataSource[];

type Props = {
    dataSources: PbPageDataSource[];
    children: React.ReactElement;
};

export const PageDataSourcesProvider = ({ dataSources = [], children }: Props) => {
    return (
        <PageDataSourcesContext.Provider value={dataSources}>
            {children}
        </PageDataSourcesContext.Provider>
    );
};
