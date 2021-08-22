import { useRecoilValue } from "recoil";
import { activeElementAtom } from "~/editor/state";
import { useElementById } from "~/editor/hooks/useElementById";

export function useActiveElement() {
    const activeElementId = useRecoilValue(activeElementAtom);
    return useElementById(activeElementId);
}
