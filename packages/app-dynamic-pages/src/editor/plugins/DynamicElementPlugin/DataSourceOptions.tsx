import React, { useMemo } from "react";
import { parse } from "graphql/language";
import { pageAtom } from "@webiny/app-page-builder/editor/recoil/modules";
import { DynamicPageAtom } from "~/types";
import { useRecoilValue } from "recoil";
import { PbEditorElement } from "@webiny/app-page-builder/types";

interface ChildrenParams {
    options: any;
}

interface Props {
    element: PbEditorElement;
    children: (params: ChildrenParams) => React.ReactElement;
}

const getItemsFromQuery = selections => {
    const items = [];
    for (const field of selections) {
        const name = field.name.value;
        const item = { key: name, children: [] };
        if (field.selectionSet) {
            item.children = getItemsFromQuery(field.selectionSet.selections);
        }
        items.push(item);
    }
    return items;
};

export const DataSourceOptions = ({ element, children }: Props) => {
    const { data } = element;
    const pageAtomValue = useRecoilValue<DynamicPageAtom>(pageAtom);
    const pageDataSource = pageAtomValue.settings.dataSources.find(
        ds => ds.id === data.dataSource.id
    );

    const options = useMemo(() => {
        const ast = parse(pageDataSource.config.query);
        return getItemsFromQuery((ast.definitions[0] as any).selectionSet.selections);
    }, [data.id]);

    return children({ options });
};
