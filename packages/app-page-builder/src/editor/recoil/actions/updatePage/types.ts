import { PageAtomType } from "../../modules";

interface OnFinish {
    data: any;
}

export type UpdatePageRevisionActionArgsType = {
    debounce?: boolean;
    page: Omit<PageAtomType, "content">;
    onFinish?: (params: OnFinish) => void;
};
