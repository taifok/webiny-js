import { useRecoilState } from "recoil";
import { sidebarAtom } from "~/editor/state";

export function useElementSidebar() {
    return useRecoilState(sidebarAtom);
}
