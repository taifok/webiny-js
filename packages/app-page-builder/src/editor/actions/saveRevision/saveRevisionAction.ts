import gql from "graphql-tag";
import lodashIsEqual from "lodash/isEqual";
import lodashDebounce from "lodash/debounce";
import {
    SaveRevisionActionEvent,
    ToggleSaveRevisionStateActionEvent,
    SaveRevisionActionParamsType
} from "./index";
import { PageAtomType } from "~/editor/state";

type PageRevisionType = Pick<PageAtomType, "title" | "snippet" | "path" | "settings"> & {
    category: string;
    content: any;
};

let lastSavedRevisionData: any = {};

const isDataEqualToLastSavedData = (data: PageRevisionType) => {
    return lodashIsEqual(data, lastSavedRevisionData);
};

const triggerOnFinish = (params?: SaveRevisionActionParamsType): void => {
    if (!params || !params.onFinish || typeof params.onFinish !== "function") {
        return;
    }
    params.onFinish();
};

let debouncedSave = null;

export const saveRevisionAction = async (event: SaveRevisionActionEvent) => {
    const eventData = event.getData();
    const page = event.getApp().getPage();

    if (page.locked) {
        return;
    }

    const data: PageRevisionType = {
        title: page.title,
        snippet: page.snippet,
        path: page.path,
        settings: page.settings,
        content: event.getApp().getElementTree(),
        category: page.category.slug
    };

    if (isDataEqualToLastSavedData(data)) {
        triggerOnFinish(eventData);
        return;
    }

    lastSavedRevisionData = data;

    const updatePage = gql`
        mutation updatePage($id: ID!, $data: PbUpdatePageInput!) {
            pageBuilder {
                updatePage(id: $id, data: $data) {
                    data {
                        id
                        content
                        title
                        status
                        savedOn
                    }
                    error {
                        code
                        message
                        data
                    }
                }
            }
        }
    `;

    if (debouncedSave) {
        debouncedSave.cancel();
    }

    const runSave = async () => {
        await event
            .getApp()
            .dispatchEvent(new ToggleSaveRevisionStateActionEvent({ saving: true }));

        // TODO: add hooks to PbEditorApp
        // await meta.client.mutate({
        //     mutation: updatePage,
        //     variables: {
        //         id: state.page.id,
        //         data
        //     }
        // });

        await event
            .getApp()
            .dispatchEvent(new ToggleSaveRevisionStateActionEvent({ saving: false }));
        triggerOnFinish(eventData);
    };

    if (eventData.debounce === false) {
        runSave();
    } else {
        debouncedSave = lodashDebounce(runSave, 2000);
        debouncedSave();
    }
};
