import { useRecoilState } from "recoil";
import { uiAtom } from "~/editor/state";

export function useUI() {
    return useRecoilState(uiAtom);
}
