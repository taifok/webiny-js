import React from "react";
import { activeElementAtom, elementByIdSelector } from "../../../state";
import { plugins } from "@webiny/plugins";
import { PbEditorPageElementPlugin, PbEditorElement } from "~/types";
import { useRecoilValue } from "recoil";
import { CloneElementActionEvent } from "~/editor/actions";
import { usePageEditor } from "~/editor/hooks/usePageEditor";

type CloneActionPropsType = {
    children: React.ReactElement;
};
const CloneAction: React.FunctionComponent<CloneActionPropsType> = ({ children }) => {
    const { app } = usePageEditor();
    const activeElementId = useRecoilValue(activeElementAtom);
    const element: PbEditorElement = useRecoilValue(elementByIdSelector(activeElementId));

    if (!element) {
        return null;
    }
    const onClick = () => {
        app.dispatchEvent(new CloneElementActionEvent({ element }));
    };

    const plugin = plugins
        .byType<PbEditorPageElementPlugin>("pb-editor-page-element")
        .find(pl => pl.elementType === element.type);

    if (!plugin) {
        return null;
    }

    return React.cloneElement(children, { onClick });
};
export default React.memo(CloneAction);
