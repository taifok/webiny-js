import { MoveBlockActionEvent, UpdateElementActionEvent } from "~/editor/actions";
import { updateBlockPosition } from "~/editor/helpers";

export const moveBlockAction = async (event: MoveBlockActionEvent) => {
    const { source, target, rootElementId } = event.getData();
    const app = event.getApp();
    const targetElement = await app.getElementById(target.id);
    if (!targetElement) {
        throw new Error(`There is no element with id "${target.id}"`);
    }

    const sourceElement = await app.getElementById(source.id);
    if (!sourceElement) {
        throw new Error(`There is no element with id "${source.id}"`);
    }

    // Get root element
    const rootElement = await app.getElementById(rootElementId);

    // Update block position.
    const root = updateBlockPosition({
        parent: rootElement,
        sourcePosition: source.position,
        targetPosition: target.position
    });

    await app.dispatchEvent(
        new UpdateElementActionEvent({
            element: root,
            history: true
        })
    );
};
