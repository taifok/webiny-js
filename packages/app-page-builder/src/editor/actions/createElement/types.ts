import { EventActionCallable, PbEditorElement } from "~/types";

export type CreateElementEventActionParamsType = {
    element: PbEditorElement;
    source: PbEditorElement;
};
export type CreateElementEventActionCallable =
    EventActionCallable<CreateElementEventActionParamsType>;
