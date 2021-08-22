import { PbEditorElement } from "~/types";
import {
    UpdateElementTreeActionEvent,
    SaveRevisionActionEvent,
    DeleteElementActionEvent
} from "..";

const removeElementFromParent = (parent: PbEditorElement, id: string): PbEditorElement => {
    return {
        ...parent,
        elements: parent.elements.filter(child => child !== id)
    };
};

export const deleteElementAction = async (event: DeleteElementActionEvent) => {
    const { element } = event.getData();
    const parent = await event.getApp().getElementParentById(element.id);
    const newParent = removeElementFromParent(parent, element.id);

    event.setState(state => {
        return {
            ...state,
            elements: {
                ...state.elements,
                [newParent.id]: newParent
            },
            activeElement: null,
            highlightElement: null
        };
    });

    await event.getApp().dispatchEvent(new SaveRevisionActionEvent());
    await event.getApp().dispatchEvent(new UpdateElementTreeActionEvent());
};
