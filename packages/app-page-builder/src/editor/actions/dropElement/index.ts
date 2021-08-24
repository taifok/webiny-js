import { PbEditorAppPlugin } from "~/editor/app/PbEditorApp";
import { PbEditorEvent } from "~/editor/app/PbEditorEvent";

import invariant from "invariant";
import { DragObjectWithTypeWithTarget } from "~/editor/components/Droppable";

export type DropElementActionDataType = {
    source: DragObjectWithTypeWithTarget;
    target: {
        id: string;
        type: string;
        path?: string;
        position: number;
    };
};

export class DropElementActionEvent extends PbEditorEvent<DropElementActionDataType> {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(DropElementActionEvent, (event: DropElementActionEvent) => {
        const { source, target } = event.getData();
        const { id, type, position } = target;

        const targetElement = event.getApp().getElementById(id);
        if (!targetElement) {
            throw new Error(`There is no element with id "${id}"`);
        }

        const elementType = event.getApp().getElementType(type);
        const onReceived = elementType.getOnReceived();
        invariant(
            onReceived,
            "To accept drops, element type must have an `onReceived` callback configured."
        );

        const sourceElement = source.id ? event.getApp().getElementById(source.id) : source;

        onReceived({
            event,
            source: sourceElement,
            target: targetElement,
            position: position
        });
    });
});
