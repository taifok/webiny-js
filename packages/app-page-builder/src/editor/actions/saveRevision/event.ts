import { SaveRevisionActionParamsType, ToggleSaveRevisionStateActionParamsType } from "./types";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";

export class SaveRevisionActionEvent extends PbEditorEvent<SaveRevisionActionParamsType> {}

export class ToggleSaveRevisionStateActionEvent extends PbEditorEvent<ToggleSaveRevisionStateActionParamsType> {}
