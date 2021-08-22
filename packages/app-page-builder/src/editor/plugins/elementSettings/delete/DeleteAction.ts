import React, { useCallback } from "react";
import { DeleteElementActionEvent } from "../../../actions";
import { activeElementAtom, elementByIdSelector } from "../../../state";
import { plugins } from "@webiny/plugins";
import { PbEditorPageElementPlugin } from "~/types";
import { useRecoilValue } from "recoil";
import { usePageEditor } from "~/editor/hooks/usePageEditor";

type DeleteActionPropsType = {
    children: React.ReactElement;
};
const DeleteAction: React.FunctionComponent<DeleteActionPropsType> = ({ children }) => {
    const { app } = usePageEditor();
    const activeElementId = useRecoilValue(activeElementAtom);
    const element = useRecoilValue(elementByIdSelector(activeElementId));

    if (!element) {
        return null;
    }

    const onClick = useCallback(() => {
        app.dispatchEvent(
            new DeleteElementActionEvent({
                element
            })
        );
    }, [activeElementId]);

    const plugin = plugins
        .byType<PbEditorPageElementPlugin>("pb-editor-page-element")
        .find(pl => pl.elementType === element.type);

    if (!plugin) {
        return null;
    }

    if (typeof plugin.canDelete === "function") {
        if (!plugin.canDelete({ element })) {
            return null;
        }
    }

    return React.cloneElement(children, { onClick });
};

export default React.memo(DeleteAction);
