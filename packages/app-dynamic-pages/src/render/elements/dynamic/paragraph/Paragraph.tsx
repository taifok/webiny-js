import React from "react";
import get from "lodash/get";
import { usePage } from "@webiny/app-page-builder/render/hooks/usePage";
import { DynamicPage } from "~/types";
import Text from "@webiny/app-page-builder/render/components/Text";
import { PbElement } from "@webiny/app-page-builder/types";

export const className = "webiny-pb-base-page-element-style webiny-pb-page-element-text";

type TextPropsType = {
    element: PbElement;
};

const Paragraph: React.FunctionComponent<TextPropsType> = ({ element }) => {
    const page = usePage<DynamicPage>();
    const elementDataSource = get(element, `data.dataSource`);
    let text = "";

    if (elementDataSource.path.includes(".")) {
        try {
            const pageDataSource = page.dataSources.find(ds => ds.id === elementDataSource.id);
            text = get(pageDataSource.data, elementDataSource.path);
        } catch {}
    }

    return <Text element={element} text={text} />;
};

export default Paragraph;
