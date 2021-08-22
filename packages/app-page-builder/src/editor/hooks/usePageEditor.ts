import { useContext } from "react";
import { EditorContext } from "../contexts/EditorProvider";

export function usePageEditor() {
    return useContext(EditorContext);
}
