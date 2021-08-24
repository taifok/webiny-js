import { PbEditorEvent } from "./PbEditorEvent";
import { PbState } from "~/editor/state/types";

export class ApplyStateChangesActionEvent extends PbEditorEvent<{ state: Partial<PbState> }> {}
