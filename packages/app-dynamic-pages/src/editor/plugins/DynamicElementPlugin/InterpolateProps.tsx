import React from "react";
import { useRecoilValue } from "recoil";
import get from "lodash/get";
import { pageAtom } from "@webiny/app-page-builder/editor/recoil/modules";
import { DynamicPageAtom } from "~/types";

export const InterpolateProps = ({ element, children }) => {
    const pageAtomValue = useRecoilValue<DynamicPageAtom>(pageAtom);
    if(!pageAtomValue.dataSources) {
        return children;
    }
    
    const props = { ...get(element.data, "properties", {}) };

    const dataSource = get(element, `data.dataSource`);
    const pageDataSource = pageAtomValue.dataSources.find(ds => ds.id === dataSource.id);

    if (!pageDataSource) {
        return children;
    }

    const values = Object.keys(props).reduce((acc, key) => {
        acc[key] = get(pageDataSource.data, props[key]);
        return acc;
    }, {});

    return React.cloneElement(children, values);
};
