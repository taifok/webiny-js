import { CreateElementActionEvent } from "~/editor/actions";

export const advancedSettingsEditorAction = (event: CreateElementActionEvent) => {
    const { element, source } = event.getData();
    // Check the source of the element (could be `saved` element which behaves differently from other elements)
    const sourceElementType = event.getApp().getElementType(source.type);

    if (!sourceElementType) {
        return;
    }

    const sourceOnCreate = sourceElementType.getOnCreate();
    if (!sourceOnCreate || sourceOnCreate !== "skip") {
        // If source element does not define a specific `onCreate` behavior - continue with the actual element plugin
        const elementType = event.getApp().getElementType(element.type);

        if (!elementType) {
            return;
        }

        const onCreate = elementType.getOnCreate();
        if (onCreate && onCreate === "open-settings") {
            event.setState(state => {
                return {
                    ...state,
                    activeElement: element.id,
                    sidebar: {
                        // Mark "Element" settings tab active in sidebar.
                        activeTabIndex: 1,
                        // Highlight "Element" settings tab in sidebar.
                        highlightTab: true
                    }
                };
            });
        }
    }
};
