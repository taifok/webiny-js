import { useRecoilState } from "recoil";
import { activeElementAtom } from "~/editor/state";

export function useActiveElementId() {
    return useRecoilState(activeElementAtom);
}
