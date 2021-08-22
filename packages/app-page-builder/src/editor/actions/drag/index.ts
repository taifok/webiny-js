import { PbEditorAppPlugin } from "~/editor/contexts/PbEditorApp";
import { PbEditorEvent } from "~/editor/contexts/app/PbEditorEvent";

export class DragStartActionEvent extends PbEditorEvent {}
export class DragEndActionEvent extends PbEditorEvent {}

export default new PbEditorAppPlugin(app => {
    app.addEventListener(DragStartActionEvent, event => {
        event.setState(state => {
            return {
                ui: {
                    ...state.ui,
                    isDragging: true
                }
            };
        });
    });
    app.addEventListener(DragEndActionEvent, event => {
        event.setState(state => {
            return {
                ui: {
                    ...state.ui,
                    isDragging: false
                }
            };
        });
    });
});
