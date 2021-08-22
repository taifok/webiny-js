import { useRecoilValue } from "recoil";
import { activePluginsByTypeNamesSelector } from "~/editor/state";

export function useActivePluginsByType(type: string) {
    return useRecoilValue(activePluginsByTypeNamesSelector(type));
}
