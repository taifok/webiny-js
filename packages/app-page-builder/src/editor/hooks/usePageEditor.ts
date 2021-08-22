import { useContext } from "react";
import { EditorAppContext } from "../contexts/EditorAppProvider";

export function usePageEditor() {
    return useContext(EditorAppContext);
}
