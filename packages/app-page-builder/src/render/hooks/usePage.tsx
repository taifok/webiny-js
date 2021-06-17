import { useContext } from "react";
import { PbPageData } from "~/types";
import { PageContext } from "../contexts/Page";

export function usePage<T extends PbPageData = PbPageData>(): T {
    return useContext<T>(PageContext);
}
