export class I18NPlugin {
    private _apply: any;
    constructor(apply) {
        this._apply = apply;
    }

    apply(i18n) {
        this._apply(i18n);
    }
}
