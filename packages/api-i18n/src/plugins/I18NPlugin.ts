import { Plugin } from "@webiny/plugins";

export class I18NPlugin extends Plugin {
    private readonly _apply: any;
    public static readonly type = "I18NPlugin";

    constructor(apply) {
        super();
        this._apply = apply;
    }

    apply(i18n) {
        this._apply(i18n);
    }
}
