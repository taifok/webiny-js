import { PbEditorElement } from "~/types";
import { CreateElementActionEvent } from "~/editor/actions";
import { ApplyStateChangesActionEvent } from "~/editor/app/ApplyStateChangesActionEvent";

const MAX_ELEMENT_FIND_RETRIES = 10;
const ELEMENT_FIND_RETRY_TIMEOUT = 100;

const clickOnImageWithRetries = (element: PbEditorElement, retryNumber: number) => {
    const image: HTMLElement = document.querySelector(
        `#${window.CSS.escape(element.id)} [data-role="select-image"]`
    );

    if (image) {
        image.click();
        return;
    } else if (retryNumber >= MAX_ELEMENT_FIND_RETRIES) {
        return;
    }
    setTimeout(() => clickOnImageWithRetries(element, retryNumber + 1), ELEMENT_FIND_RETRY_TIMEOUT);
};

export const imageCreatedEditorAction = (event: CreateElementActionEvent) => {
    const { element, source } = event.getData();

    if (element.type !== "image") {
        return;
    }

    // Check the source of the element (could be `saved` element which behaves differently from other elements)
    const imageElementType = event.getApp().getElementType(source.type);

    if (!imageElementType) {
        return;
    }

    const onCreate = imageElementType.getOnCreate();
    if (!onCreate || onCreate !== "skip") {
        clickOnImageWithRetries(element, 0);
    }
};
