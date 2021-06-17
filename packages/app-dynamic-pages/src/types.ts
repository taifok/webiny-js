import { PageAtomType } from "@webiny/app-page-builder/editor/recoil/modules";
import { PbPageData } from "@webiny/app-page-builder/types";

// TODO: define DataSource type
export interface DynamicPageAtom extends PageAtomType {
    dataSources?: any;
    settings?: PageAtomType["settings"] & {
        dataSources?: any;
    };
}

export interface DynamicPage extends PbPageData {
    dataSources?: any;
}

export interface DataSource<T = Record<string, any>> {
    id: string;
    type: string;
    name: string;
    config: T;
}
