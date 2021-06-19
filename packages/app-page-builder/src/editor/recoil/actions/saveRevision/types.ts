interface OnFinishParams {
    // New page data returned by the update mutation
    data: any;
}

export type SaveRevisionActionArgsType = {
    debounce?: boolean;
    onFinish?: (params: OnFinishParams) => void;
};

export type ToggleSaveRevisionStateActionArgsType = {
    saving: boolean;
};
