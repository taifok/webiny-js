import { AfterDropElementActionEvent } from "~/editor/actions/afterDropElement/index";

export const afterDropElementAction = (event: AfterDropElementActionEvent) => {
    const { element } = event.getData();

    const elementType = event.getApp().getElementType(element.type);
    const onCreate = elementType.getOnCreate();
    console.log("afterDropElement", onCreate);
    if (onCreate === "open-settings") {
        return {};
    }

    if (onCreate === "skipElementHighlight") {
        return {};
    }

    event.setState(state => {
        return {
            ...state,
            activeElement: element.id,
            sidebar: {
                activeTabIndex: 0,
                highlightTab: true
            }
        };
    });
};
