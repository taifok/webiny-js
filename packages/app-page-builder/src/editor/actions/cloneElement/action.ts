import { CloneElementActionEvent, UpdateElementActionEvent } from "..";
import { PbEditorElement } from "~/types";
import { PbEditorApp } from "~/editor/app/PbEditorApp";
import { getNanoid } from "~/editor/helpers";

export const cloneElement = async (
    app: PbEditorApp,
    element: PbEditorElement
): Promise<PbEditorElement> => {
    return {
        ...(element as PbEditorElement),
        id: getNanoid(),
        elements: await Promise.all(
            element.elements.map(async el => {
                return cloneElement(app, await app.getElementById(el as string));
            })
        )
    };
};

export const cloneElementAction = (event: CloneElementActionEvent) => {
    const { element } = event.getData();
    const parent = event.getApp().getElementById(element.parent);
    const position = parent.elements.findIndex(el => el === element.id) + 1;

    const newElement: any = {
        ...parent,
        elements: [
            ...parent.elements.slice(0, position),
            cloneElement(event.getApp(), element),
            ...(position < parent.elements.length ? parent.elements.slice(position) : [])
        ]
    };

    event.getApp().dispatchEvent(
        new UpdateElementActionEvent({
            element: newElement,
            history: true
        })
    );
};
