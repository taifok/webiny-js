import { SetterOrUpdater, useRecoilState } from "recoil";
import { activeElementAtom } from "~/editor/state";
import { useElementById } from "~/editor/hooks/useElementById";
import { PbEditorElement } from "~/types";

export function useActiveElement(): [PbEditorElement, SetterOrUpdater<string>] {
    const [activeElementId, setActiveElement] = useRecoilState(activeElementAtom);
    const [activeElement] = useElementById(activeElementId);

    return [activeElement, setActiveElement];
}
