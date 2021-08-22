import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";
import { PbState } from "~/editor/state/types";

export class ApplyStateChangesActionEvent extends PbEditorEvent<{ state: Partial<PbState> }> {}
