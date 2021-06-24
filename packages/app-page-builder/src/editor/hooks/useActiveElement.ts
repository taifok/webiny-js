import { useRecoilValue } from "recoil";
import { activeElementAtom, elementWithChildrenByIdSelector } from "~/editor/recoil/modules";
import { PbEditorElement } from "~/types";
import { UpdateElementActionEvent } from "~/editor/recoil/actions";
import { useEventActionHandler } from "~/editor/hooks/useEventActionHandler";

type UseActiveElement = [PbEditorElement, (element: PbEditorElement) => void];

export function useActiveElement(): UseActiveElement {
    const handler = useEventActionHandler();
    const activeElementId = useRecoilValue(activeElementAtom);
    const element = useRecoilValue(elementWithChildrenByIdSelector(activeElementId));

    const updateElement = (element: PbEditorElement) => {
        handler.trigger(
            new UpdateElementActionEvent({
                element,
                history: true
            })
        );
    };

    return [element, updateElement];
}
