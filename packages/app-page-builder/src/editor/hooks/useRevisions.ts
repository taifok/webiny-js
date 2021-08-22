import { useRecoilState } from "recoil";
import { revisionsAtom } from "~/editor/state";

export function useRevisions() {
    return useRecoilState(revisionsAtom);
}
