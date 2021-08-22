import { useRecoilState } from "recoil";
import { elementByIdSelector } from "~/editor/state";

export function useElementById(id: string) {
    return useRecoilState(elementByIdSelector(id));
}
