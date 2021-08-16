import { BindComponent } from "@webiny/form/Bind";
import { ValidationError } from "@webiny/validation";
import { CmsEditorField } from "~/types";
import { Class, ClassPlugin, Pluginable, ApplyFunction } from "~/admin/contexts/Cms/Pluginable";

export interface ValidatorConfig {
    name: string;
    message: any;
    settings: any;
}

interface FieldValidatorConfig {
    name?: string;
    label?: string;
    description?: string;
    defaultMessage?: string;
    defaultSettings?: Record<string, any>;
    validator?: (value: any, validator: ValidatorConfig) => Promise<boolean | ValidationError>;
    renderSettings?: (props: {
        field: CmsEditorField;
        Bind: BindComponent;
        setValue: (name: string, value: any) => void;
        setMessage: (message: string) => void;
        data: ValidatorConfig;
    }) => React.ReactElement;
}

export class FieldValidator extends Pluginable {
    private _config: FieldValidatorConfig = {};

    constructor(name: string) {
        super();
        this._config.name = name;
    }

    applyPlugins(type: Class<FieldValidator>) {
        super.applyPlugins(FieldValidator);
        super.applyPlugins(type);
    }

    getName() {
        return this._config.name;
    }

    getLabel() {
        return this._config.label;
    }

    setLabel(label: string) {
        this._config.label = label;
    }

    getDescription() {
        return this._config.description;
    }

    setDescription(description: string) {
        this._config.description = description;
    }

    getDefaultMessage() {
        return this._config.defaultMessage;
    }

    setDefaultMessage(defaultMessage: string) {
        this._config.defaultMessage = defaultMessage;
    }

    getDefaultSettings() {
        return this._config.defaultSettings;
    }

    setDefaultSettings(defaultSettings: Record<string, any>) {
        this._config.defaultSettings = defaultSettings;
    }

    getValidator() {
        return this._config.validator || (() => true);
    }

    setValidator(validator: FieldValidatorConfig["validator"]) {
        this._config.validator = validator;
    }

    getRenderSettings() {
        return this._config.renderSettings;
    }

    setRenderSettings(renderSettings: FieldValidatorConfig["renderSettings"]) {
        this._config.renderSettings = renderSettings;
    }

    renderSettings(params: Parameters<FieldValidatorConfig["renderSettings"]>[0]) {
        const renderSettings = this.getRenderSettings();
        return renderSettings ? renderSettings(params) : null;
    }
}

export class FieldValidatorPlugin<TClass extends FieldValidator> extends ClassPlugin<TClass> {
    constructor(fieldClass: Class<TClass>, apply: ApplyFunction<TClass>) {
        super(fieldClass, apply);
    }
}
