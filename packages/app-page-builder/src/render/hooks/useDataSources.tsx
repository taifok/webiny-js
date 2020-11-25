import { useContext } from "react";
import {
    PageDataSourcesContext,
    PageDataSourcesContextValue
} from "../contexts/PageDataSourcesContext";

export function useDataSources(): PageDataSourcesContextValue {
    return useContext(PageDataSourcesContext);
}
