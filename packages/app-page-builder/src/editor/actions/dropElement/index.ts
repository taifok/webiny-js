import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";

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
    app.addEventListener(DropElementActionEvent, async (event: DropElementActionEvent) => {
        const { source, target } = event.getData();
        const { id, type, position } = target;

        const targetElement = await event.getApp().getElementById(id);
        if (!targetElement) {
            throw new Error(`There is no element with id "${id}"`);
        }

        const elementType = event.getApp().getElementType(type);
        const onReceived = elementType.getOnReceived();
        invariant(
            onReceived,
            "To accept drops, element type must have an `onReceived` callback configured."
        );

        const sourceElement = source.id ? await event.getApp().getElementById(source.id) : source;

        console.log("dropElement", {
            event,
            source: sourceElement,
            target: targetElement,
            position: position
        });

        await onReceived({
            event,
            source: sourceElement,
            target: targetElement,
            position: position
        });
    });
});
