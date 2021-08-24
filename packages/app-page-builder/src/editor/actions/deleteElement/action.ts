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

export const deleteElementAction = (event: DeleteElementActionEvent) => {
    const { element } = event.getData();
    const parent = event.getApp().getElementParentById(element.id);
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

    event.getApp().dispatchEvent(new SaveRevisionActionEvent());
    event.getApp().dispatchEvent(new UpdateElementTreeActionEvent());
};
