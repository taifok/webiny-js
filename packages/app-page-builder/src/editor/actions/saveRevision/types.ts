export type SaveRevisionActionParamsType = {
    debounce?: boolean;
    onFinish?: () => void;
};

export type ToggleSaveRevisionStateActionParamsType = {
    saving: boolean;
};
