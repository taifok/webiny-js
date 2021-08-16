import { plugins } from "@webiny/plugins";
import { FieldType } from "./FieldType";
import { ClassPlugin, Pluginable } from "./Pluginable";
import { CmsEditorFieldTypePlugin } from "~/types";

export interface ApplyFunction {
    (app: HeadlessCMS): void;
}

export class HeadlessCMS extends Pluginable {
    private _fieldTypes: FieldType[] = [];

    constructor() {
        super();

        this.setupLegacyPlugins();

        this.applyPlugins(HeadlessCMS);
    }

    addFieldType(fieldType: FieldType) {
        this._fieldTypes.push(fieldType);
    }

    getFieldType(type: string) {
        return this._fieldTypes.find(fType => fType.getName() === type);
    }

    getFieldTypes() {
        return this._fieldTypes;
    }

    private setupLegacyPlugins() {
        const fieldPlugins = plugins.byType<CmsEditorFieldTypePlugin>("cms-editor-field-type");
        for (const { field } of fieldPlugins) {
            const fieldType = new FieldType(field.type);
            fieldType.setLabel(field.label);
            fieldType.setDescription(field.description);
            fieldType.setIcon(field.icon);
            this.addFieldType(fieldType);
        }
    }
}

export class HeadlessCMSPlugin extends ClassPlugin<HeadlessCMS> {
    constructor(apply: ApplyFunction) {
        super(HeadlessCMS, apply);
    }
}
